/*import React, { useEffect, useState } from 'react';
import { getOnlineUsers } from '../api';

export default function UserList() {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    getOnlineUsers().then(res => setOnlineUsers(res.data));
  }, []);

  return (
    <div>
      <h3>Online Users</h3>
      <ul>
        {onlineUsers.map(u => (
          <li key={u.id}>{u.username} {u.profilePhotoUrl && (
            <img
              src={`http://localhost:8080${u.profilePhotoUrl}`}
              alt="Profile"
              style={{ width: 80, height: 80, borderRadius: '50%' }}
            />
          )}</li>
        ))}
      </ul>
    </div>
  );
}*/

import React, { useEffect, useState } from 'react';
import { getOnlineUsers } from '../api';

export default function UserList() {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    getOnlineUsers().then(res => setOnlineUsers(res.data));
  }, []);

  return (
    <div style={{ background: 'linear-gradient(to bottom, #e8f5e8, #c8e6c9)', minHeight: '100vh', padding: '20px', borderRadius: '10px' }}>
      <h3 style={{ color: '#25D366', fontWeight: 'bold' }}>Online Users</h3>
      <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <ul className="list-group">
          {onlineUsers.map(u => (
            <li key={u.id} className="list-group-item d-flex align-items-center" style={{ borderRadius: '10px', marginBottom: '5px' }}>
              {u.username}
              {u.profilePhotoUrl && (
                <img
                  src={`http://localhost:8080${u.profilePhotoUrl}`}
                  alt="Profile"
                  style={{ width: 40, height: 40, borderRadius: '50%', marginLeft: '10px', border: '2px solid #25D366' }}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}