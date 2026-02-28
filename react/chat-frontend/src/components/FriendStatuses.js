import React, { useEffect, useState } from 'react';
import { getFriendStatuses, markStatusViewed } from '../api';
import { Modal, Button } from 'react-bootstrap';

export default function FriendStatuses({ user, allUsers }) {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  const openModal = (status) => {
    setSelectedStatus(status);
    setShowModal(true);
  };

  const closeModal = async () => {
    if (selectedStatus && !selectedStatus.viewedBy.includes(user.id)) {
      try {
        await markStatusViewed(selectedStatus.id, user.id);
        setStatuses(prev => prev.map(s => 
          s.id === selectedStatus.id ? { ...s, viewCount: s.viewCount + 1, viewedBy: [...s.viewedBy, user.id] } : s
        ));
      } catch (err) {
        console.error('Failed to mark status viewed:', err);
      }
    }
    setShowModal(false);
    setSelectedStatus(null);
  };

  if (loading) return <div className="text-center mt-5">Loading friend statuses...</div>;

  return (
    <div className="container mt-4" style={{ backgroundColor: '#e8f5e8', minHeight: '100vh', padding: '20px' }}>
      <h3>All Friends' Statuses</h3>
      {statuses.length === 0 ? (
        <p>No friend statuses yet. Add friends and have them create statuses!</p>
      ) : (
        <div style={{ maxHeight: '600px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          <div className="row">
            {statuses.map((status) => {
              const statusUser = allUsers.find(u => u.id === status.userId);
              const profilePhoto = statusUser?.profilePhotoUrl;
              const username = statusUser?.username || status.userId;
              const isViewed = status.viewedBy.includes(user.id);
              return (
                <div key={status.id} className="col-md-4 mb-4">
                  <div 
                    className="card" 
                    style={{ cursor: 'pointer', border: isViewed ? '2px solid #ccc' : '2px solid #007bff' }}
                    onClick={() => openModal(status)}
                  >
                    <div className="card-body text-center">
                      {profilePhoto ? (
                        <img
                          src={`http://localhost:8080${profilePhoto}`}
                          alt={`${username}'s profile`}
                          className="rounded-circle mb-2"
                          style={{ width: 80, height: 80, objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className="bg-secondary rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-2"
                          style={{ width: 80, height: 80, fontSize: 32 }}
                        >
                          {username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <h5 className="card-title">{profilePhoto ? '' : username}</h5>
                      <p className="card-text">{status.caption || 'No caption'}</p>
                      <small className="text-muted">{status.viewCount} views</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedStatus?.userId}'s Status</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '5px' }}>
          {selectedStatus && (
            <div>
              {selectedStatus.caption && <p><strong>{selectedStatus.caption}</strong></p>}
              {selectedStatus.type === 'IMAGE' && selectedStatus.contentUrl && (
                <img
                  src={`http://localhost:8080${selectedStatus.contentUrl}`}
                  alt="Status"
                  style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 5 }}
                />
              )}
              {selectedStatus.type === 'VIDEO' && selectedStatus.contentUrl && (
                <video controls style={{ maxWidth: '100%', maxHeight: 400 }}>
                  <source src={`http://localhost:8080${selectedStatus.contentUrl}`} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              )}
              {selectedStatus.type === 'TEXT' && <p>{selectedStatus.contentUrl}</p>}
              <small>
                Posted: {new Date(selectedStatus.createdAt).toLocaleString()} | 
                {selectedStatus.viewCount} views | 
                Expires: {new Date(selectedStatus.expiresAt).toLocaleDateString()}
              </small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}