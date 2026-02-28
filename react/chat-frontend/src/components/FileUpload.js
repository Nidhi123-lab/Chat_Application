/*import React, { useState } from 'react';
import { uploadFile } from '../api';

export default function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    try {
      const res = await uploadFile(file);
      onUpload(res.data);
      setError('');
    } catch (e) {
      setError('Upload failed');
    }
  };

  return (
    <div className="mb-3">
      <input 
        type="file" 
        className="form-control" 
        onChange={e => setFile(e.target.files[0])} 
      />
      <button 
        className="btn btn-primary mt-2" 
        onClick={handleUpload}
        disabled={!file}
      >
        Upload
      </button>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
    </div>
  );
}*/

import React, { useState } from 'react';
import { uploadFile } from '../api';

export default function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    try {
      const res = await uploadFile(file);
      onUpload(res.data);
      setError('');
    } catch (e) {
      setError('Upload failed');
    }
  };

  return (
    <div className="mb-3">
      <input 
        type="file" 
        className="form-control" 
        onChange={e => setFile(e.target.files[0])} 
      />
      <button 
        className="btn btn-primary mt-2" 
        onClick={handleUpload}
        disabled={!file}
      >
        Upload
      </button>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
    </div>
  );
}

