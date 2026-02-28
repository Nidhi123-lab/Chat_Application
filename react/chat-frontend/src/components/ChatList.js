/*import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getAllUsers, getUserGroups, getLastMessage, addFriend, getFriends } from '../api';
import { FaUser } from 'react-icons/fa';

export default function ChatList({ user, onSelectChat, onSelectProfile }) {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [previews, setPreviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [friends, setFriends] = useState([]);
  const isLoadingRef = useRef(false);

  const generatePrivateChatId = (userId1, userId2) => {
    if (!userId1 || !userId2 || userId1 === userId2) {
      throw new Error("Cannot generate chat ID for same user or invalid IDs");
    }
    const id1 = userId1 < userId2 ? userId1 : userId2;
    const id2 = userId1 < userId2 ? userId2 : userId1;
    return `${id1}_${id2}`;
  };

  const fetchPreview = useCallback(async (chatId, isGroup) => {
    if (!user) return;
    try {
      const res = await getLastMessage(chatId, isGroup);
      const lastMessage = res.data;
      const unreadCount = lastMessage?.viewed ? 0 : 1;
      setPreviews(prev => ({ ...prev, [chatId]: { lastMessage, unreadCount } }));
    } catch (err) {
      console.warn(`No preview for ${chatId}:`, err.message);
      setPreviews(prev => ({ ...prev, [chatId]: { lastMessage: null, unreadCount: 0 } }));
    }
  }, [user]);

  const loadChats = useCallback(async () => {
    if (!user || !user.id || isLoadingRef.current) {
      if (!user) setError('No user logged in. Please log in again.');
      setLoading(false);
      return;
    }
    isLoadingRef.current = true;
    setLoading(true);
    setError('');
    try {
      const [usersRes, groupsRes, friendsRes] = await Promise.all([
        getAllUsers(),
        getUserGroups(user.id),
        getFriends(user.id)
      ]);
      const allUsers = usersRes.data ? usersRes.data.filter(u => String(u.id) !== String(user.id)) : [];
      setUsers(allUsers);
      setGroups(groupsRes.data || []);
      setFriends(friendsRes.data || []);

      const maxPreviews = 10;
      const userPreviews = allUsers.slice(0, maxPreviews).map(u => {
        try {
          const chatId = generatePrivateChatId(user.id, u.id);
          return fetchPreview(chatId, false);
        } catch (err) {
          console.warn('Skipping invalid chatId for user:', u.id, err.message);
          return Promise.resolve();
        }
      });
      const groupPreviews = (groupsRes.data || []).slice(0, maxPreviews).map(g => fetchPreview(g.id, true));
      await Promise.all([...userPreviews, ...groupPreviews]);
    } catch (err) {
      console.error('Error loading chats:', err);
      setError('Failed to load chats. Check console for details.');
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [user, fetchPreview]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredGroups = groups.filter(g =>
    g.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSelect = (chatId, isGroup) => {
    onSelectChat(chatId, isGroup);
  };

  const handleAddFriend = async (friendId) => {
    try {
      await addFriend(user.id, friendId);
      const newFriend = users.find(u => u.id === friendId);
      if (newFriend) setFriends([...friends, newFriend]);
    } catch (err) {
      alert('Failed to add friend');
    }
  };

  const isFriend = (userId) => friends.some(f => f.id === userId);

  const getPreview = (chatId) => previews[chatId] || { lastMessage: null, unreadCount: 0 };

  if (loading) {
    return (
      <div className="p-3">
        <h5>Chats</h5>
        <div className="list-group">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="list-group-item p-3">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="skeleton w-50 mb-1" style={{ height: 16, background: '#f0f0f0' }}></div>
                  <div className="skeleton w-75" style={{ height: 12, background: '#f0f0f0' }}></div>
                </div>
                <div className="skeleton w-25" style={{ height: 12, background: '#f0f0f0' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3" style={{ height: '100%', overflowY: 'auto' }}>
      <h5>Chats</h5>
      {error && <div className="alert alert-warning mb-3">{error}</div>}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search chats..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <ul className="list-group list-group-flush">
        {filteredUsers.length === 0 && filteredGroups.length === 0 && !searchQuery ? (
          <li className="list-group-item text-muted text-center py-3">No chats yet. Start a conversation!</li>
        ) : (
          <>
            {filteredUsers.map(u => {
              const chatId = generatePrivateChatId(user.id, u.id);
              const { lastMessage, unreadCount } = getPreview(chatId);
              const isAlreadyFriend = isFriend(u.id);
              return (
                <li
                  key={chatId}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-2"
                  style={{ cursor: 'pointer', border: 'none' }}
                  onClick={() => handleSelect(chatId, false)}
                >
                  <div className="d-flex align-items-center">
                    {u.profilePhotoUrl ? (
                      <img
                        src={`http://localhost:8080${u.profilePhotoUrl}`}
                        alt={`${u.username}'s profile`}
                        className="rounded-circle me-3"
                        style={{ width: 40, height: 40, objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        className="bg-secondary rounded-circle me-3 d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ width: 40, height: 40, fontSize: 16 }}
                      >
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="fw-bold">{u.username}</div>
                      <small className="text-muted">
                        {lastMessage ? (
                          lastMessage.content ? `${lastMessage.content.substring(0, 50)}...` : ''  // Removed "Media shared"
                        ) : 'No messages yet'}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <small className="d-block text-muted me-2">
                      {lastMessage && lastMessage.timestamp ? new Date(lastMessage.timestamp).toLocaleTimeString() : ''}
                    </small>

                    {unreadCount > 0 && <span className="badge bg-primary rounded-pill me-2">{unreadCount}</span>}
                    {!isAlreadyFriend && (
                      <button
                        className="btn btn-sm btn-outline-success ms-2"
                        onClick={(e) => { e.stopPropagation(); handleAddFriend(u.id); }}
                      >
                        Add Friend
                      </button>
                    )}
                    {isAlreadyFriend && <span className="badge bg-success ms-2">Friend</span>}
                    <button
                      className="btn btn-sm btn-outline-secondary ms-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProfile(u.id);
                      }}
                      title="View Profile"
                    >
                      <FaUser />
                    </button>
                  </div>
                </li>
              );
            })}

            {filteredGroups.map(g => {
              const { lastMessage, unreadCount } = getPreview(g.id);
              return (
                <li
                  key={g.id}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-2"
                  style={{ cursor: 'pointer', border: 'none' }}
                  onClick={() => handleSelect(g.id, true)}
                >
                  <div>
                    <div className="fw-bold">{g.name}</div>
                    <small className="text-muted">
                      {lastMessage ? (
                        lastMessage.content ? `${lastMessage.content.substring(0, 50)}...` : ''  // Removed "Media shared"
                      ) : 'No messages yet'}
                    </small>
                  </div>
                  <div className="text-end">
                    <small className="d-block text-muted">
                      {lastMessage && lastMessage.timestamp ? new Date(lastMessage.timestamp).toLocaleTimeString() : 'Unknown time'}  // Fixed "Invalid Date"
                    </small>
                    {unreadCount > 0 && <span className="badge bg-primary rounded-pill">{unreadCount}</span>}
                  </div>
                </li>
              );
            })}
          </>
        )}
      </ul>

      {searchQuery && filteredUsers.length === 0 && filteredGroups.length === 0 && (
        <p className="text-muted mt-3">No chats found for "{searchQuery}".</p>
      )}
    </div>
  );
}*/

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getAllUsers, getUserGroups, getLastMessage, addFriend, getFriends } from '../api';
import { FaUser } from 'react-icons/fa';

export default function ChatList({ user, onSelectChat, onSelectProfile }) {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [previews, setPreviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [friends, setFriends] = useState([]); // Track friends
  const isLoadingRef = useRef(false);

  const generatePrivateChatId = (userId1, userId2) => {
    if (!userId1 || !userId2 || userId1 === userId2) {
      throw new Error("Cannot generate chat ID for same user or invalid IDs");
    }
    const id1 = userId1 < userId2 ? userId1 : userId2;
    const id2 = userId1 < userId2 ? userId2 : userId1;
    return `${id1}_${id2}`;
  };

  const fetchPreview = useCallback(async (chatId, isGroup) => {
    if (!user) return;
    try {
      const res = await getLastMessage(chatId, isGroup);
      const lastMessage = res.data;
      const unreadCount = lastMessage?.viewed ? 0 : 1;
      setPreviews(prev => ({ ...prev, [chatId]: { lastMessage, unreadCount } }));
    } catch (err) {
      console.warn(`No preview for ${chatId}:`, err.message);
      setPreviews(prev => ({ ...prev, [chatId]: { lastMessage: null, unreadCount: 0 } }));
    }
  }, [user]);

  const loadChats = useCallback(async () => {
    if (!user || !user.id || isLoadingRef.current) {
      if (!user) setError('No user logged in. Please log in again.');
      setLoading(false);
      return;
    }
    isLoadingRef.current = true;
    setLoading(true);
    setError('');
    try {
      const [usersRes, groupsRes, friendsRes] = await Promise.all([
        getAllUsers(),
        getUserGroups(user.id),
        getFriends(user.id) // Fetch friends
      ]);
      const allUsers = usersRes.data ? usersRes.data.filter(u => String(u.id) !== String(user.id)) : [];
      setUsers(allUsers);
      setGroups(groupsRes.data || []);
      setFriends(friendsRes.data || []); // Set friends

      const maxPreviews = 10;
      const userPreviews = allUsers.slice(0, maxPreviews).map(u => {
        try {
          const chatId = generatePrivateChatId(user.id, u.id);
          return fetchPreview(chatId, false);
        } catch (err) {
          console.warn('Skipping invalid chatId for user:', u.id, err.message);
          return Promise.resolve();
        }
      });
      const groupPreviews = (groupsRes.data || []).slice(0, maxPreviews).map(g => fetchPreview(g.id, true));
      await Promise.all([...userPreviews, ...groupPreviews]);
    } catch (err) {
      console.error('Error loading chats:', err);
      setError('Failed to load chats. Check console for details.');
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [user, fetchPreview]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredGroups = groups.filter(g =>
    g.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSelect = (chatId, isGroup) => {
    onSelectChat(chatId, isGroup);
  };

  const handleAddFriend = async (friendId) => { // Add friend
    try {
      await addFriend(user.id, friendId);
      const newFriend = users.find(u => u.id === friendId);
      if (newFriend) setFriends([...friends, newFriend]);
    } catch (err) {
      alert('Failed to add friend');
    }
  };

  const isFriend = (userId) => friends.some(f => f.id === userId); // Check if friend

  const getPreview = (chatId) => previews[chatId] || { lastMessage: null, unreadCount: 0 };

  if (loading) {
    return (
      <div className="p-3">
        <h5>Chats</h5>
        <div className="list-group">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="list-group-item p-3">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="skeleton w-50 mb-1" style={{ height: 16, background: '#f0f0f0' }}></div>
                  <div className="skeleton w-75" style={{ height: 12, background: '#f0f0f0' }}></div>
                </div>
                <div className="skeleton w-25" style={{ height: 12, background: '#f0f0f0' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>  {/* Scrollable container */}
      <h5>Chats</h5>
      {error && <div className="alert alert-warning mb-3">{error}</div>}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search chats..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <ul className="list-group list-group-flush">
        {filteredUsers.length === 0 && filteredGroups.length === 0 && !searchQuery ? (
          <li className="list-group-item text-muted text-center py-3">No chats yet. Start a conversation!</li>
        ) : (
          <>
            {filteredUsers.map(u => {
              const chatId = generatePrivateChatId(user.id, u.id);
              const { lastMessage, unreadCount } = getPreview(chatId);
              const isAlreadyFriend = isFriend(u.id); // Check if friend
              return (
                <li
                  key={chatId}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-2"
                  style={{ cursor: 'pointer', border: 'none' }}
                  onClick={() => handleSelect(chatId, false)}
                >
                  <div className="d-flex align-items-center">
                    {u.profilePhotoUrl ? (
                      <img
                        src={`http://localhost:8080${u.profilePhotoUrl}`}
                        alt={`${u.username}'s profile`}
                        className="rounded-circle me-3"
                        style={{ width: 40, height: 40, objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        className="bg-secondary rounded-circle me-3 d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ width: 40, height: 40, fontSize: 16 }}
                      >
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="fw-bold">{u.username}</div>
                      <small className="text-muted">
                        {lastMessage ? (
                          lastMessage.content ? `${lastMessage.content.substring(0, 50)}...` : ''
                        ) : 'No messages yet'}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <small className="d-block text-muted me-2">
                      {lastMessage && lastMessage.timestamp ? (
                        (() => {
                          const date = new Date(lastMessage.timestamp);
                          return isNaN(date.getTime()) ? 'No time' : date.toLocaleTimeString();  // Fallback to 'No time' instead of 'Invalid Date'
                        })()
                      ) : ''}
                    </small>
                    {unreadCount > 0 && <span className="badge bg-primary rounded-pill me-2">{unreadCount}</span>}
                    {!isAlreadyFriend && ( // Add friend button
                      <button
                        className="btn btn-sm btn-outline-success ms-2"
                        onClick={(e) => { e.stopPropagation(); handleAddFriend(u.id); }}
                      >
                        Add Friend
                      </button>
                    )}
                    {isAlreadyFriend && <span className="badge bg-success ms-2">Friend</span>}
                    <button
                      className="btn btn-sm btn-outline-secondary ms-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProfile(u.id);
                      }}
                      title="View Profile"
                    >
                      <FaUser />
                    </button>
                  </div>
                </li>
              );
            })}

            {filteredGroups.map(g => {
              const { lastMessage, unreadCount } = getPreview(g.id);
              return (
                <li
                  key={g.id}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-2"
                  style={{ cursor: 'pointer', border: 'none' }}
                  onClick={() => handleSelect(g.id, true)}
                >
                  <div>
                    <div className="fw-bold">{g.name}</div>
                    <small className="text-muted">
                      {lastMessage ? (
                        lastMessage.content ? `${lastMessage.content.substring(0, 50)}...` : 'Media shared'
                      ) : 'No messages yet'}
                    </small>
                  </div>
                  <div className="text-end">
                    <small className="d-block text-muted">
                      {lastMessage ? new Date(lastMessage.timestamp).toLocaleTimeString() : ''}
                    </small>
                    {unreadCount > 0 && <span className="badge bg-primary rounded-pill">{unreadCount}</span>}
                  </div>
                </li>
              );
            })}
          </>
        )}
      </ul>

      {searchQuery && filteredUsers.length === 0 && filteredGroups.length === 0 && (
        <p className="text-muted mt-3">No chats found for "{searchQuery}".</p>
      )}
    </div>
  );
}