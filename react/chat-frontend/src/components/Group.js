/*import React, { useEffect, useState } from 'react';
import { createGroup, getUserGroups, addGroupMember, getFriends } from '../api';

export default function Group({ user, onGroupCreated }) {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [newMemberId, setNewMemberId] = useState('');
  const [memberUsername, setMemberUsername] = useState(''); // For input display
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadGroups();
      loadFriends();
    }
  }, [user]);

  const loadGroups = async () => {
    try {
      const res = await getUserGroups(user.id);
      setGroups(res.data || []);
    } catch (err) {
      console.error('Failed to load groups:', err);
      setError('Failed to load groups');
    }
  };

  const loadFriends = async () => {
    try {
      const res = await getFriends(user.id);
      setFriends(res.data || []);
    } catch (err) {
      console.error('Failed to load friends:', err);
      setError('Failed to load friends');
    } finally {
      setLoadingFriends(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    const group = {
      name: groupName,
      createdBy: user.id,
      members: [user.id],
      admin: user.id,
      createdAt: new Date(),
    };
    try {
      const res = await createGroup(group);
      const newGroup = res.data;
      setGroups([...groups, newGroup]);
      setGroupName('');
      if (onGroupCreated) onGroupCreated(newGroup.id);
    } catch (err) {
      setError('Failed to create group');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMemberUsername(value);
    if (value.trim()) {
      const filtered = friends.filter(friend =>
        friend.username.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFriends(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectFriend = (friend) => {
    setMemberUsername(friend.username);
    setNewMemberId(friend.id);
    setShowSuggestions(false);
  };

  const handleAddMember = async () => {
    if (!selectedGroup || !newMemberId.trim()) {
      setError('Please select a group and a member');
      return;
    }
    try {
      await addGroupMember(selectedGroup.id, newMemberId);
      const res = await getUserGroups(user.id);
      setGroups(res.data);
      setNewMemberId('');
      setMemberUsername('');
      setError('');
    } catch (err) {
      setError('Failed to add member');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Your Groups</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <ul className="list-group mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {groups.map(g => (
          <li 
            key={g.id} 
            className={`list-group-item d-flex justify-content-between align-items-center ${selectedGroup?.id === g.id ? 'active' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedGroup(g)}
          >
            {g.name} 
            <span className="badge bg-secondary rounded-pill">{g.members.length}</span>
          </li>
        ))}
      </ul>

      <div className="input-group mb-3">
        <input 
          type="text" 
          className="form-control" 
          placeholder="New group name" 
          value={groupName} 
          onChange={e => setGroupName(e.target.value)} 
        />
        <button className="btn btn-primary" onClick={handleCreateGroup}>Create Group</button>
      </div>

      {selectedGroup && (
        <div className="card p-3">
          <h5>Add Member to {selectedGroup.name}</h5>
          <div className="mb-3 position-relative">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search friends by username" 
              value={memberUsername} 
              onChange={handleInputChange} 
              disabled={loadingFriends}
            />
            {loadingFriends && <p className="text-muted mt-1">Loading friends...</p>}
            {showSuggestions && (
              <ul className="list-group position-absolute w-100" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                {filteredFriends.map(friend => (
                  <li 
                    key={friend.id} 
                    className="list-group-item list-group-item-action"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelectFriend(friend)}
                  >
                    {friend.username}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button 
            className="btn btn-outline-primary" 
            onClick={handleAddMember} 
            disabled={!newMemberId || loadingFriends}
          >
            Add Member
          </button>
        </div>
      )}
    </div>
  );
}*/

import React, { useEffect, useState } from 'react';
import { createGroup, getUserGroups, addGroupMember, getFriends } from '../api';

export default function Group({ user, onGroupCreated }) {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [newMemberId, setNewMemberId] = useState('');
  const [memberUsername, setMemberUsername] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadGroups();
      loadFriends();
    }
  }, [user]);

  const loadGroups = async () => {
    try {
      const res = await getUserGroups(user.id);
      setGroups(res.data || []);
    } catch (err) {
      console.error('Failed to load groups:', err);
      setError('Failed to load groups');
    }
  };

  const loadFriends = async () => {
    try {
      const res = await getFriends(user.id);
      setFriends(res.data || []);
    } catch (err) {
      console.error('Failed to load friends:', err);
      setError('Failed to load friends');
    } finally {
      setLoadingFriends(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    const group = {
      name: groupName,
      createdBy: user.id,
      members: [user.id],
      admin: user.id,
      createdAt: new Date(),
    };
    try {
      const res = await createGroup(group);
      const newGroup = res.data;
      setGroups([...groups, newGroup]);
      setGroupName('');
      if (onGroupCreated) onGroupCreated(newGroup.id);
    } catch (err) {
      setError('Failed to create group');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMemberUsername(value);
    if (value.trim()) {
      const filtered = friends.filter(friend =>
        friend.username.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFriends(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectFriend = (friend) => {
    setMemberUsername(friend.username);
    setNewMemberId(friend.id);
    setShowSuggestions(false);
  };

  const handleAddMember = async () => {
    if (!selectedGroup || !newMemberId.trim()) {
      setError('Please select a group and a member');
      return;
    }
    try {
      await addGroupMember(selectedGroup.id, newMemberId);
      const res = await getUserGroups(user.id);
      setGroups(res.data);
      setNewMemberId('');
      setMemberUsername('');
      setError('');
    } catch (err) {
      setError('Failed to add member');
    }
  };

  return (
    <div className="container mt-4" style={{ background: 'linear-gradient(to bottom, #e8f5e8, #c8e6c9)', height: '100%', display: 'flex', flexDirection: 'column', padding: '20px', borderRadius: '10px', overflow: 'hidden' }}>
      <h3 style={{ color: '#25D366', fontWeight: 'bold', flexShrink: 0 }}>Your Groups</h3>
      {error && <div className="alert alert-danger" style={{ borderRadius: '10px', flexShrink: 0 }}>{error}</div>}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <ul className="list-group mb-3" style={{ borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          {groups.map(g => (
            <li 
              key={g.id} 
              className={`list-group-item d-flex justify-content-between align-items-center ${selectedGroup?.id === g.id ? 'active' : ''}`}
              style={{ cursor: 'pointer', borderRadius: '10px', marginBottom: '5px' }}
              onClick={() => setSelectedGroup(g)}
            >
              {g.name} 
              <span className="badge" style={{ backgroundColor: '#25D366', borderRadius: '10px' }}>{g.members.length}</span>
            </li>
          ))}
        </ul>

        <div className="input-group mb-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="New group name" 
            value={groupName} 
            onChange={e => setGroupName(e.target.value)} 
            style={{ borderRadius: '10px' }}
          />
          <button className="btn" onClick={handleCreateGroup} style={{ backgroundColor: '#25D366', color: 'white', borderRadius: '10px', border: 'none' }}>Create Group</button>
        </div>

        {selectedGroup && (
          <div className="card p-3" style={{ borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h5 style={{ color: '#25D366' }}>Add Member to {selectedGroup.name}</h5>
            <div className="mb-3 position-relative">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search friends by username" 
                value={memberUsername} 
                onChange={handleInputChange} 
                disabled={loadingFriends}
                style={{ borderRadius: '10px' }}
              />
              {loadingFriends && <p className="text-muted mt-1">Loading friends...</p>}
              {showSuggestions && (
                <ul className="list-group position-absolute w-100" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                  {filteredFriends.map(friend => (
                    <li 
                      key={friend.id} 
                      className="list-group-item list-group-item-action"
                      style={{ cursor: 'pointer', borderRadius: '10px' }}
                      onClick={() => handleSelectFriend(friend)}
                    >
                      {friend.username}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button 
              className="btn" 
              onClick={handleAddMember} 
              disabled={!newMemberId || loadingFriends}
              style={{ backgroundColor: '#25D366', color: 'white', borderRadius: '10px', border: 'none' }}
            >
              Add Member
            </button>
          </div>
        )}
      </div>
    </div>
  );
}