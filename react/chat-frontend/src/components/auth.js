/*import React, { useState } from 'react';
import { register, login } from '../api';

export default function Auth({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);  // New: State for profile photo file
  const [photoPreview, setPhotoPreview] = useState(null);  // New: Optional preview URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        // Pass profilePhoto to the register API call
        await register({ username, password }, profilePhoto);
        alert('Registration successful! Please login.');
        setIsRegister(false);
        setProfilePhoto(null);  // Reset after success
        setPhotoPreview(null);
      } else {
        const res = await login(username, password);
        console.log('Login response:', res.data);
        const user = res.data;
        localStorage.setItem('user', JSON.stringify(user));
        onLogin(user);
      }
    } catch (err) {
      console.log('Auth error:', err.response);
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation: Check size (e.g., 5MB max) and type (images only)
      if (file.size > 5 * 1024 * 1024) {  // 5MB limit (adjust as needed)
        setError('File too large. Max 5MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setProfilePhoto(file);
      setError('');  // Clear any previous errors
      // Optional: Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center">{isRegister ? 'Register' : 'Login'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isRegister && (  // New: Show file input only during registration
              <div className="mb-3">
                <label htmlFor="profilePhoto" className="form-label">Profile Photo (optional)</label>
                <input
                  type="file"
                  className="form-control"
                  id="profilePhoto"
                  accept="image/*"  // Restrict to images
                  onChange={handleFileChange}
                />
                {photoPreview && (  // New: Show preview if selected
                  <div className="mt-2">
                    <img
                      src={photoPreview}
                      alt="Profile Preview"
                      style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
            </button>
          </form>
          <button
            className="btn btn-link w-100 mt-2"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Have an account? Login' : 'No account? Register'}
          </button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>
    </div>
  );
}*/

import React, { useState } from 'react';
import { register, login } from '../api';

export default function Auth({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);  // New: State for profile photo file
  const [photoPreview, setPhotoPreview] = useState(null);  // New: Optional preview URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        // Pass profilePhoto to the register API call
        await register({ username, password }, profilePhoto);
        alert('Registration successful! Please login.');
        setIsRegister(false);
        setProfilePhoto(null);  // Reset after success
        setPhotoPreview(null);
      } else {
        const res = await login(username, password);
        console.log('Login response:', res.data);
        const user = res.data;
        localStorage.setItem('user', JSON.stringify(user));
        onLogin(user);
      }
    } catch (err) {
      console.log('Auth error:', err.response);
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation: Check size (e.g., 5MB max) and type (images only)
      if (file.size > 5 * 1024 * 1024) {  // 5MB limit (adjust as needed)
        setError('File too large. Max 5MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setProfilePhoto(file);
      setError('');  // Clear any previous errors
      // Optional: Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center">{isRegister ? 'Register' : 'Login'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isRegister && (  // New: Show file input only during registration
              <div className="mb-3">
                <label htmlFor="profilePhoto" className="form-label">Profile Photo (optional)</label>
                <input
                  type="file"
                  className="form-control"
                  id="profilePhoto"
                  accept="image/*"  // Restrict to images
                  onChange={handleFileChange}
                />
                {photoPreview && (  // New: Show preview if selected
                  <div className="mt-2">
                    <img
                      src={photoPreview}
                      alt="Profile Preview"
                      style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
            </button>
          </form>
          <button
            className="btn btn-link w-100 mt-2"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Have an account? Login' : 'No account? Register'}
          </button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>
    </div>
  );
}