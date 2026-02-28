/*import React, { useEffect, useState } from 'react';
import { getFriends, removeFriend } from '../api';

function Friends({ user, allUsers }) {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (user) {
      getFriends(user.id).then(res => setFriends(res.data || []));
    }
  }, [user]);

  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriend(user.id, friendId);
      setFriends(friends.filter(f => f.id !== friendId));
    } catch (err) {
      alert('Failed to remove friend');
    }
  };

  return (
    <div className="p-3">
      <h5>Your Friends</h5>
      <ul className="list-group">
        {friends.map(f => (
          <li key={f.id} className="list-group-item d-flex justify-content-between">
            <div>
              {f.username}
              {f.profilePhotoUrl && <img src={`http://localhost:8080${f.profilePhotoUrl}`} alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%' }} />}
            </div>
            <button className="btn btn-sm btn-danger" onClick={() => handleRemoveFriend(f.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Friends;*/

import React, { useEffect, useState } from 'react';
import { getFriends, removeFriend } from '../api';

function Friends({ user, allUsers }) {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (user) {
      getFriends(user.id).then(res => setFriends(res.data || []));
    }
  }, [user]);

  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriend(user.id, friendId);
      setFriends(friends.filter(f => f.id !== friendId));
    } catch (err) {
      alert('Failed to remove friend');
    }
  };

  return (
    <div className="p-3" style={{ background: 'linear-gradient(to bottom, #e8f5e8, #c8e6c9)', minHeight: '100vh', borderRadius: '10px' }}>
      <h5 style={{ color: '#25D366', fontWeight: 'bold' }}>Your Friends</h5>
      <ul className="list-group" style={{ borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        {friends.map(f => (
          <li key={f.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ borderRadius: '10px', marginBottom: '5px' }}>
            <div className="d-flex align-items-center">
              {f.profilePhotoUrl && <img src={`http://localhost:8080${f.profilePhotoUrl}`} alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%', marginRight: '10px', border: '2px solid #25D366' }} />}
              <span style={{ color: '#388E3C' }}>{f.username}</span>
            </div>
            <button className="btn btn-sm" onClick={() => handleRemoveFriend(f.id)} style={{ backgroundColor: '#25D366', color: 'white', borderRadius: '10px', border: 'none' }}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Friends;