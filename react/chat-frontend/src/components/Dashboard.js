/*import React, { useState, useEffect } from 'react';
import { getAllUsers, getFriendStatuses, markStatusViewed } from '../api';
import ChatList from './ChatList';
import Chat from './Chat';
import { Modal, Button } from 'react-bootstrap';
import { FaComments, FaEye, FaUsers, FaFileUpload, FaUserFriends } from 'react-icons/fa';

export default function Dashboard({ user }) {
  const [selectedChatId, setSelectedChatId] = useState(() => {
    return localStorage.getItem('selectedChatId') || null;
  });

  const [isGroupChat, setIsGroupChat] = useState(() => {
    const stored = localStorage.getItem('isGroupChat');
    return stored === 'true';
  });

  const [allUsers, setAllUsers] = useState([]);
  const [activeSection, setActiveSection] = useState('chat');
  const [statuses, setStatuses] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    if (user) {
      getAllUsers().then(res => setAllUsers(res.data || []));
      loadStatuses();
    }
  }, [user]);

  const loadStatuses = async () => {
    if (!user) return;
    try {
      const res = await getFriendStatuses(user.id);
      setStatuses(res.data || []);
    } catch (err) {
      console.error('Failed to load statuses:', err);
    } finally {
      setLoadingStatuses(false);
    }
  };

  const handleSelectChat = (chatId, group) => {
    setSelectedChatId(chatId);
    setIsGroupChat(group);
    localStorage.setItem('selectedChatId', chatId);
    localStorage.setItem('isGroupChat', group.toString());
  };

  const handleGroupCreated = (groupId) => {
    setSelectedChatId(groupId);
    setIsGroupChat(true);
    localStorage.setItem('selectedChatId', groupId);
    localStorage.setItem('isGroupChat', 'true');
  };

  const openStatusModal = (status) => {
    setSelectedStatus(status);
    setShowStatusModal(true);
  };

  const closeStatusModal = async () => {
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
    setShowStatusModal(false);
    setSelectedStatus(null);
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'chat':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ flex: 1 }}>
              <Chat 
                user={user} 
                chatId={selectedChatId} 
                isGroupChat={isGroupChat} 
                allUsers={allUsers} 
              />
            </div>
            <div style={{ 
              height: 300,
              borderTop: '1px solid #ccc', 
              overflowY: 'auto', 
              padding: '10px',
              backgroundColor: '#f9f9f9'
            }}>
              <h6>Friend Statuses</h6>
              {loadingStatuses ? (
                <p>Loading statuses...</p>
              ) : statuses.length === 0 ? (
                <p>No friend statuses yet. Add friends to see their updates!</p>
              ) : (
                <div style={{
                  display: 'flex',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  gap: '10px',
                  paddingBottom: '10px'
                }}>
                  {statuses.map((status) => {
                    const isViewed = status.viewedBy.includes(user.id);
                    const profilePhoto = status.profilePhotoUrl;
                    const displayName = status.username || status.userId;
                    return (
                      <div
                        key={status.id}
                        style={{
                          flexShrink: 0,
                          cursor: 'pointer',
                          textAlign: 'center',
                          border: isViewed ? '2px solid #ccc' : '2px solid #007bff',
                          borderRadius: '50%',
                          padding: 5,
                          width: '80px'
                        }}
                        onClick={() => openStatusModal(status)}
                        title={`Click to view ${displayName}'s status`}
                      >
                        <div
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            backgroundColor: profilePhoto ? 'transparent' : '#ddd',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 20,
                            color: '#fff',
                            overflow: 'hidden'
                          }}
                        >
                          {profilePhoto ? (
                            <img
                              src={`http://localhost:8080${profilePhoto}`}
                              alt={`${displayName}'s profile`}
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            displayName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <small style={{ display: 'block', marginTop: 5 }}>{displayName}</small>
                      </div>
                    );
                  })}
                </div>
              )}
              <button className="btn btn-primary mt-2" onClick={() => setShowStatusModal(true)}>View All Statuses</button>
            </div>
          </div>
        );
      case 'status':
        return <div>Status Component Here</div>;
      case 'friendStatuses':
        return <div>Friend Statuses Component Here</div>;
      case 'friends':
        return <div>Friends Component Here</div>;
      case 'group':
        return <div>Group Component Here</div>;
      case 'upload':
        return <div>Upload Component Here</div>;
      case 'users':
        return <div>Users Component Here</div>;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}> 
      <div style={{ width: '25%', borderRight: '1px solid #ccc' }}>
        <ChatList user={user} onSelectChat={handleSelectChat} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {renderMainContent()}
      </div>
      <Modal show={showStatusModal} onHide={closeStatusModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>All Friend Statuses</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {statuses.length === 0 ? (
            <p>No statuses to show.</p>
          ) : (
            statuses.map((status) => (
              <div key={status.id} className="mb-3 border p-2 rounded">
                <div className="d-flex align-items-center mb-2">
                  {status.profilePhotoUrl && (
                    <img
                      src={`http://localhost:8080${status.profilePhotoUrl}`}
                      alt={`${status.username}'s profile`}
                      style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }}
                    />
                  )}
                  <strong>{status.username || status.userId}</strong>
                </div>
                {status.caption && <p><strong>{status.caption}</strong></p>}
                {status.type === 'IMAGE' && status.contentUrl && (
                  <img
                    src={`http://localhost:8080${status.contentUrl}`}
                    alt="Status"
                    style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 5 }}
                  />
                )}
                {status.type === 'VIDEO' && status.contentUrl && (
                  <video controls style={{ maxWidth: '100%', maxHeight: 400 }}>
                    <source src={`http://localhost:8080${status.contentUrl}`} type="video/mp4" />
                    Your browser does not support video playback.
                  </video>
                )}
                {status.type === 'TEXT' && <p>{status.contentUrl}</p>}
                <small>
                  Posted: {new Date(status.createdAt).toLocaleString()} | 
                  {status.viewCount} views | 
                  Expires: {new Date(status.expiresAt).toLocaleDateString()}
                </small>
              </div>
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeStatusModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}*/

import React, { useState, useEffect } from 'react';
import { getAllUsers, getFriendStatuses, markStatusViewed } from '../api';
import ChatList from './ChatList';
import Chat from './Chat';
import { Modal, Button } from 'react-bootstrap';

export default function Dashboard({ user }) {
  const [selectedChatId, setSelectedChatId] = useState(() => localStorage.getItem('selectedChatId') || null);
  const [isGroupChat, setIsGroupChat] = useState(() => localStorage.getItem('isGroupChat') === 'true');
  const [allUsers, setAllUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    if (user) {
      getAllUsers().then(res => setAllUsers(res.data || []));
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
      setLoadingStatuses(false);
    }
  };

  const handleSelectChat = (chatId, group) => {
    setSelectedChatId(chatId);
    setIsGroupChat(group);
    localStorage.setItem('selectedChatId', chatId);
    localStorage.setItem('isGroupChat', group.toString());
  };

  const handleSelectProfile = (userId) => {
    alert(`Viewing profile for user ${userId}`);  // Placeholder - replace with modal or navigation
  };

  const openStatusModal = (status) => {
    setSelectedStatus(status);
    setShowStatusModal(true);
  };

  const closeStatusModal = async () => {
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
    setShowStatusModal(false);
    setSelectedStatus(null);
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>  {/* Full height, no overflow */}
      {/* Left Sidebar: Chat List */}
      <div style={{ width: '25%', borderRight: '1px solid #ccc', overflowY: 'auto' }}>  {/* Scrollable if needed */}
        <ChatList user={user} onSelectChat={handleSelectChat} onSelectProfile={handleSelectProfile} />
      </div>
      {/* Right Main Area: Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>  {/* Full height for Chat */}
        <Chat user={user} chatId={selectedChatId} isGroupChat={isGroupChat} allUsers={allUsers} />
      </div>
      {/* Status Modal */}
      <Modal show={showStatusModal} onHide={closeStatusModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>All Friend Statuses</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {statuses.length === 0 ? (
            <p>No statuses to show.</p>
          ) : (
            statuses.map((status) => (
              <div key={status.id} className="mb-3 border p-2 rounded">
                <div className="d-flex align-items-center mb-2">
                  {status.profilePhotoUrl && (
                    <img
                      src={`http://localhost:8080${status.profilePhotoUrl}`}
                      alt={`${status.username}'s profile`}
                      style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }}
                    />
                  )}
                  <strong>{status.username || status.userId}</strong>
                </div>
                {status.caption && <p><strong>{status.caption}</strong></p>}
                {status.type === 'IMAGE' && status.contentUrl && (
                  <img
                    src={`http://localhost:8080${status.contentUrl}`}
                    alt="Status"
                    style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 5 }}
                  />
                )}
                {status.type === 'VIDEO' && status.contentUrl && (
                  <video controls style={{ maxWidth: '100%', maxHeight: 400 }}>
                    <source src={`http://localhost:8080${status.contentUrl}`} type="video/mp4" />
                    Your browser does not support video playback.
                  </video>
                )}
                {status.type === 'TEXT' && <p>{status.contentUrl}</p>}
                <small>
                  Posted: {new Date(status.createdAt).toLocaleString()} | 
                  {status.viewCount} views | 
                  Expires: {new Date(status.expiresAt).toLocaleDateString()}
                </small>
              </div>
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeStatusModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}