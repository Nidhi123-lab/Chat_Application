/*import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from './components/auth';
import Friends from './components/Friends';
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import Group from './components/Group';
import Status from './components/Status';
import UserList from './components/UserList';
import FriendStatuses from './components/FriendStatuses';
import { FaComments, FaEye, FaUsers, FaFileUpload, FaUserFriends } from 'react-icons/fa';
import { getAllUsers } from './api';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [activeSection, setActiveSection] = useState('chat');
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (user) {
      getAllUsers().then(res => setAllUsers(res.data || []));
    }
  }, [user]);

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'chat':
        return <Dashboard user={user} />;
      case 'status':
        return <Status user={user} />;
      case 'friendStatuses':
        return <FriendStatuses user={user} allUsers={allUsers} />;
      case 'friends':
        return <Friends user={user} allUsers={allUsers} />;
      case 'group':
        return <Group user={user} />;
      case 'upload':
        return <FileUpload onUpload={(fileInfo) => alert(`File uploaded: ${fileInfo.filename}`)} />;
      case 'users':
        return <UserList user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
        <div className="container-fluid">
          <span className="navbar-brand">Welcome, {user.username}</span>
          {user.profilePhotoUrl && (
            <img
              src={`http://localhost:8080${user.profilePhotoUrl}`}
              alt="Profile"
              style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }}
            />
          )}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'chat' ? 'active' : ''}`}
                  onClick={() => setActiveSection('chat')}
                >
                  <FaComments className="me-1" /> Chat
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'status' ? 'active' : ''}`}
                  onClick={() => setActiveSection('status')}
                >
                  <FaEye className="me-1" /> Status
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'friendStatuses' ? 'active' : ''}`}
                  onClick={() => setActiveSection('friendStatuses')}
                >
                  <FaUserFriends className="me-1" /> Friend Statuses
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'friends' ? 'active' : ''}`}
                  onClick={() => setActiveSection('friends')}
                >
                  <FaUserFriends className="me-1" /> Friends
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'group' ? 'active' : ''}`}
                  onClick={() => setActiveSection('group')}
                >
                  <FaUsers className="me-1" /> Groups
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'upload' ? 'active' : ''}`}
                  onClick={() => setActiveSection('upload')}
                >
                  <FaFileUpload className="me-1" /> Upload
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveSection('users')}
                >
                  <FaUsers className="me-1" /> Users
                </button>
              </li>
            </ul>
            <button 
              className="btn btn-danger" 
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setUser(null);
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="row">
        <div className="col-12">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

export default App;*/

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from './components/auth';
import Friends from './components/Friends';
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import Group from './components/Group';
import Status from './components/Status';
import UserList from './components/UserList';
import FriendStatuses from './components/FriendStatuses';
import { FaComments, FaEye, FaUsers, FaFileUpload, FaUserFriends } from 'react-icons/fa';
import { getAllUsers } from './api';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [activeSection, setActiveSection] = useState('chat');
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (user) {
      getAllUsers().then(res => setAllUsers(res.data || []));
    }
  }, [user]);

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'chat':
        return <Dashboard user={user} />;
      case 'status':
        return <Status user={user} />;
      case 'friendStatuses':
        return <FriendStatuses user={user} allUsers={allUsers} />;
      case 'friends':
        return <Friends user={user} allUsers={allUsers} />;
      case 'group':
        return <Group user={user} />;
      case 'upload':
        return <FileUpload onUpload={(fileInfo) => alert(`File uploaded: ${fileInfo.filename}`)} />;
      case 'users':
        return <UserList user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div className="container-fluid" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Decorated Top Navigation Bar */}
      <nav className="navbar navbar-expand-lg" style={{ background: 'linear-gradient(to right, #1f2421ff, #4f794fff)', borderRadius: '10px', marginBottom: '0', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', flexShrink: 0 }}>
        <div className="container-fluid">
          <span className="navbar-brand" style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>
            Welcome, {user.username}
            {user.profilePhotoUrl && (
              <img
                src={`http://localhost:8080${user.profilePhotoUrl}`}
                alt="Profile"
                style={{ width: 40, height: 40, borderRadius: '50%', marginLeft: '10px', border: '2px solid white' }}
              />
            )}
          </span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" style={{ backgroundColor: 'white' }}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <button 
                  className="nav-link" 
                  onClick={() => setActiveSection('chat')}
                  style={{ 
                    color: activeSection === 'chat' ? '#FFD700' : 'white', 
                    fontWeight: 'bold', 
                    backgroundColor: activeSection === 'chat' ? 'rgba(255,255,255,0.2)' : 'transparent', 
                    borderRadius: '10px', 
                    padding: '10px 15px', 
                    margin: '5px', 
                    border: 'none', 
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = activeSection === 'chat' ? 'rgba(255,255,255,0.2)' : 'transparent'}
                >
                  <FaComments style={{ marginRight: '8px' }} /> Chat
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link" 
                  onClick={() => setActiveSection('status')}
                  style={{ 
                    color: activeSection === 'status' ? '#FFD700' : 'white', 
                    fontWeight: 'bold', 
                    backgroundColor: activeSection === 'status' ? 'rgba(255,255,255,0.2)' : 'transparent', 
                    borderRadius: '10px', 
                    padding: '10px 15px', 
                    margin: '5px', 
                    border: 'none', 
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = activeSection === 'status' ? 'rgba(255,255,255,0.2)' : 'transparent'}
                >
                  <FaEye style={{ marginRight: '8px' }} /> Status
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link" 
                  onClick={() => setActiveSection('friendStatuses')}
                  style={{ 
                    color: activeSection === 'friendStatuses' ? '#FFD700' : 'white', 
                    fontWeight: 'bold', 
                    backgroundColor: activeSection === 'friendStatuses' ? 'rgba(255,255,255,0.2)' : 'transparent', 
                    borderRadius: '10px', 
                    padding: '10px 15px', 
                    margin: '5px', 
                    border: 'none', 
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = activeSection === 'friendStatuses' ? 'rgba(255,255,255,0.2)' : 'transparent'}
                >
                  <FaUserFriends style={{ marginRight: '8px' }} /> Friend Statuses
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link" 
                  onClick={() => setActiveSection('friends')}
                  style={{ 
                    color: activeSection === 'friends' ? '#FFD700' : 'white', 
                    fontWeight: 'bold', 
                    backgroundColor: activeSection === 'friends' ? 'rgba(255,255,255,0.2)' : 'transparent', 
                    borderRadius: '10px', 
                    padding: '10px 15px', 
                    margin: '5px', 
                    border: 'none', 
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = activeSection === 'friends' ? 'rgba(255,255,255,0.2)' : 'transparent'}
                >
                  <FaUserFriends style={{ marginRight: '8px' }} /> Friends
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link" 
                  onClick={() => setActiveSection('group')}
                  style={{ 
                    color: activeSection === 'group' ? '#FFD700' : 'white', 
                    fontWeight: 'bold', 
                    backgroundColor: activeSection === 'group' ? 'rgba(255,255,255,0.2)' : 'transparent', 
                    borderRadius: '10px', 
                    padding: '10px 15px', 
                    margin: '5px', 
                    border: 'none', 
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = activeSection === 'group' ? 'rgba(255,255,255,0.2)' : 'transparent'}
                >
                  <FaUsers style={{ marginRight: '8px' }} /> Groups
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link" 
                  onClick={() => setActiveSection('upload')}
                  style={{ 
                    color: activeSection === 'upload' ? '#FFD700' : 'white', 
                    fontWeight: 'bold', 
                    backgroundColor: activeSection === 'upload' ? 'rgba(255,255,255,0.2)' : 'transparent', 
                    borderRadius: '10px', 
                    padding: '10px 15px', 
                    margin: '5px', 
                    border: 'none', 
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = activeSection === 'upload' ? 'rgba(255,255,255,0.2)' : 'transparent'}
                >
                  <FaFileUpload style={{ marginRight: '8px' }} /> Upload
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link" 
                  onClick={() => setActiveSection('users')}
                  style={{ 
                    color: activeSection === 'users' ? '#FFD700' : 'white', 
                    fontWeight: 'bold', 
                    backgroundColor: activeSection === 'users' ? 'rgba(255,255,255,0.2)' : 'transparent', 
                    borderRadius: '10px', 
                    padding: '10px 15px', 
                    margin: '5px', 
                    border: 'none', 
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = activeSection === 'users' ? 'rgba(255,255,255,0.2)' : 'transparent'}
                >
                  <FaUsers style={{ marginRight: '8px' }} /> Users
                </button>
              </li>
            </ul>
            <button 
              className="btn" 
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setUser(null);
              }}
              style={{ backgroundColor: '#FF5722', color: 'white', borderRadius: '10px', border: 'none', padding: '10px 15px', fontWeight: 'bold' }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content - Full Height Without Scrolling */}
      <div className="row" style={{ flex: 1, overflow: 'hidden' }}>
        <div className="col-12" style={{ height: '100%', overflow: 'auto' }}>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

export default App;
