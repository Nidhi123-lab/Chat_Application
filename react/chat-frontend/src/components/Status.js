/*import React, { useEffect, useState } from 'react';
import { createStatus, getFriendStatuses, markStatusViewed, uploadFile } from '../api';

export default function Status({ user }) {
  const [statuses, setStatuses] = useState([]);
  const [contentUrl, setContentUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [type, setType] = useState('TEXT');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loadingStatuses, setLoadingStatuses] = useState(true);

  useEffect(() => {
    if (user) {
      loadStatuses();
    }
  }, [user]);

  const loadStatuses = async () => {
    try {
      const res = await getFriendStatuses(user.id);
      setStatuses(res.data || []);
    } catch (err) {
      console.error('Failed to load statuses:', err);
      setError('Failed to load statuses');
    } finally {
      setLoadingStatuses(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File too large. Max 10MB.');
      return;
    }
    if (type === 'IMAGE' && !file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    if (type === 'VIDEO' && !file.type.startsWith('video/')) {
      setError('Please select a valid video file.');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const uploadRes = await uploadFile(file);
      setContentUrl(uploadRes.data.url); // Set the uploaded file URL
      setSelectedFile(file); // Store for preview
    } catch (err) {
      setError('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateStatus = async () => {
    if (!contentUrl.trim() && type !== 'TEXT') {
      setError('Please provide content or select a file.');
      return;
    }
    if (type === 'TEXT' && !contentUrl.trim()) {
      setError('Please enter text content.');
      return;
    }

    const status = {
      userId: user.id,
      type,
      contentUrl,
      caption,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      viewCount: 0,
      viewedBy: [],
    };

    try {
      await createStatus(status);
      setContentUrl('');
      setCaption('');
      setSelectedFile(null);
      setType('TEXT');
      setError('');
      loadStatuses(); // Refresh list
    } catch (err) {
      setError('Failed to create status. Please try again.');
    }
  };

  const handleViewStatus = async (status) => {
    if (!status.viewedBy.includes(user.id)) {
      try {
        await markStatusViewed(status.id, user.id);
        loadStatuses(); // Refresh to update view count
      } catch (err) {
        console.error('Failed to mark status viewed:', err);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3>Create Status</h3>
      <div className="mb-3">
        <label className="form-label">Type</label>
        <select 
          className="form-select" 
          value={type} 
          onChange={(e) => {
            setType(e.target.value);
            setContentUrl(''); // Reset content when type changes
            setSelectedFile(null);
            setError('');
          }}
        >
          <option value="TEXT">Text</option>
          <option value="IMAGE">Image</option>
          <option value="VIDEO">Video</option>
        </select>
      </div>

      {type === 'TEXT' && (
        <div className="mb-3">
          <label className="form-label">Text Content</label>
          <textarea 
            className="form-control" 
            placeholder="Enter your text status" 
            value={contentUrl} 
            onChange={(e) => setContentUrl(e.target.value)} 
            rows={3}
          />
        </div>
      )}

      {(type === 'IMAGE' || type === 'VIDEO') && (
        <div className="mb-3">
          <label className="form-label">Select {type.toLowerCase()} file</label>
          <input 
            type="file" 
            className="form-control" 
            accept={type === 'IMAGE' ? 'image/*' : 'video/*'} 
            onChange={handleFileSelect} 
            disabled={uploading}
          />
          {uploading && <p className="text-muted mt-2">Uploading...</p>}
          {selectedFile && (
            <div className="mt-2">
              <p className="text-success">File selected: {selectedFile.name}</p>
              {type === 'IMAGE' && (
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Preview" 
                  style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px' }} 
                />
              )}
              {type === 'VIDEO' && (
                <video 
                  controls 
                  style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px' }}
                >
                  <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
                  Your browser does not support video playback.
                </video>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Caption (optional)</label>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Add a caption" 
          value={caption} 
          onChange={(e) => setCaption(e.target.value)} 
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <button 
        className="btn btn-primary mb-4" 
        onClick={handleCreateStatus} 
        disabled={uploading || (type !== 'TEXT' && !contentUrl)}
      >
        Post Status
      </button>

      <h3>Your Friend Statuses</h3>
      {loadingStatuses ? (
        <p>Loading statuses...</p>
      ) : statuses.length === 0 ? (
        <p>No friend statuses yet.</p>
      ) : (
        <ul className="list-group">
          {statuses.map((s) => (
            <li 
              key={s.id} 
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => handleViewStatus(s)}
            >
              <div>
                <b>{s.username || s.userId}</b>: {s.caption || 'No caption'}
                {s.type === 'IMAGE' && s.contentUrl && (
                  <img 
                    src={`http://localhost:8080${s.contentUrl}`} 
                    alt="Status" 
                    style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '5px', borderRadius: '5px' }} 
                  />
                )}
                {s.type === 'VIDEO' && s.contentUrl && (
                  <video controls style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '5px', borderRadius: '5px' }}>
                    <source src={`http://localhost:8080${s.contentUrl}`} type="video/mp4" />
                    Your browser does not support video playback.
                  </video>
                )}
                {s.type === 'TEXT' && <p>{s.contentUrl}</p>}
              </div>
              <span className="badge bg-primary rounded-pill">{s.viewCount} views</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}*/

import React, { useEffect, useState } from 'react';
import { createStatus, getFriendStatuses, markStatusViewed, uploadFile } from '../api';

export default function Status({ user }) {
  const [statuses, setStatuses] = useState([]);
  const [contentUrl, setContentUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [type, setType] = useState('TEXT');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loadingStatuses, setLoadingStatuses] = useState(true);

  useEffect(() => {
    if (user) {
      loadStatuses();
    }
  }, [user]);

  const loadStatuses = async () => {
    try {
      const res = await getFriendStatuses(user.id);
      setStatuses(res.data || []);
    } catch (err) {
      console.error('Failed to load statuses:', err);
      setError('Failed to load statuses');
    } finally {
      setLoadingStatuses(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File too large. Max 10MB.');
      return;
    }
    if (type === 'IMAGE' && !file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    if (type === 'VIDEO' && !file.type.startsWith('video/')) {
      setError('Please select a valid video file.');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const uploadRes = await uploadFile(file);
      setContentUrl(uploadRes.data.url);
      setSelectedFile(file);
    } catch (err) {
      setError('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateStatus = async () => {
    if (!contentUrl.trim() && type !== 'TEXT') {
      setError('Please provide content or select a file.');
      return;
    }
    if (type === 'TEXT' && !contentUrl.trim()) {
      setError('Please enter text content.');
      return;
    }

    const status = {
      userId: user.id,
      type,
      contentUrl,
      caption,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      viewCount: 0,
      viewedBy: [],
    };

    try {
      await createStatus(status);
      setContentUrl('');
      setCaption('');
      setSelectedFile(null);
      setType('TEXT');
      setError('');
      loadStatuses();
    } catch (err) {
      setError('Failed to create status. Please try again.');
    }
  };

  const handleViewStatus = async (status) => {
    if (!status.viewedBy.includes(user.id)) {
      try {
        await markStatusViewed(status.id, user.id);
        loadStatuses();
      } catch (err) {
        console.error('Failed to mark status viewed:', err);
      }
    }
  };

  return (
    <div className="container mt-4" style={{ background: 'linear-gradient(to bottom, #e8f5e8, #c8e6c9)', minHeight: '100vh', padding: '20px', borderRadius: '10px' }}>
      <h3 style={{ color: '#25D366', fontWeight: 'bold' }}>Create Status</h3>
      <div className="mb-3">
        <label className="form-label" style={{ color: '#388E3C' }}>Type</label>
        <select 
          className="form-select" 
          value={type} 
          onChange={(e) => {
            setType(e.target.value);
            setContentUrl('');
            setSelectedFile(null);
            setError('');
          }}
          style={{ borderRadius: '10px' }}
        >
          <option value="TEXT">Text</option>
          <option value="IMAGE">Image</option>
          <option value="VIDEO">Video</option>
        </select>
      </div>

      {type === 'TEXT' && (
        <div className="mb-3">
          <label className="form-label" style={{ color: '#388E3C' }}>Text Content</label>
          <textarea 
            className="form-control" 
            placeholder="Enter your text status" 
            value={contentUrl} 
            onChange={(e) => setContentUrl(e.target.value)} 
            rows={3}
            style={{ borderRadius: '10px' }}
          />
        </div>
      )}

      {(type === 'IMAGE' || type === 'VIDEO') && (
        <div className="mb-3">
          <label className="form-label" style={{ color: '#388E3C' }}>Select {type.toLowerCase()} file</label>
          <input 
            type="file" 
            className="form-control" 
            accept={type === 'IMAGE' ? 'image/*' : 'video/*'} 
            onChange={handleFileSelect} 
            disabled={uploading}
            style={{ borderRadius: '10px' }}
          />
          {uploading && <p className="text-muted mt-2">Uploading...</p>}
          {selectedFile && (
            <div className="mt-2">
              <p className="text-success">File selected: {selectedFile.name}</p>
              {type === 'IMAGE' && (
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Preview" 
                  style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} 
                />
              )}
              {type === 'VIDEO' && (
                <video 
                  controls 
                  style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                >
                  <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
                  Your browser does not support video playback.
                </video>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mb-3">
        <label className="form-label" style={{ color: '#388E3C' }}>Caption (optional)</label>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Add a caption" 
          value={caption} 
          onChange={(e) => setCaption(e.target.value)} 
          style={{ borderRadius: '10px' }}
        />
      </div>

      {error && <div className="alert alert-danger" style={{ borderRadius: '10px' }}>{error}</div>}

      <button 
        className="btn" 
        onClick={handleCreateStatus} 
        disabled={uploading || (type !== 'TEXT' && !contentUrl)}
        style={{ backgroundColor: '#25D366', color: 'white', borderRadius: '10px', border: 'none' }}
      >
        Post Status
      </button>

      <h3 style={{ color: '#25D366', fontWeight: 'bold', marginTop: '30px' }}>Your Friend Statuses</h3>
      {loadingStatuses ? (
        <p>Loading statuses...</p>
      ) : statuses.length === 0 ? (
        <p>No friend statuses yet.</p>
      ) : (
        <ul className="list-group" style={{ borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          {statuses.map((s) => (
            <li 
              key={s.id} 
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer', borderRadius: '10px', marginBottom: '5px' }}
              onClick={() => handleViewStatus(s)}
            >
              <div>
                <b style={{ color: '#388E3C' }}>{s.username || s.userId}</b>: {s.caption || 'No caption'}
                {s.type === 'IMAGE' && s.contentUrl && (
                  <img 
                    src={`http://localhost:8080${s.contentUrl}`} 
                    alt="Status" 
                    style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '5px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} 
                  />
                )}
                {s.type === 'VIDEO' && s.contentUrl && (
                  <video controls style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '5px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <source src={`http://localhost:8080${s.contentUrl}`} type="video/mp4" />
                    Your browser does not support video playback.
                  </video>
                )}
                {s.type === 'TEXT' && <p>{s.contentUrl}</p>}
              </div>
              <span className="badge" style={{ backgroundColor: '#25D366', borderRadius: '10px' }}>{s.viewCount} views</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}