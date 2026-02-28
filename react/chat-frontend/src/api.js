/*
import axios from 'axios';
import axiosRetry from 'axios-retry';
import DOMPurify from 'dompurify';  // Install: npm install dompurify

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  if (!config.url.includes('/auth/')) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      config.headers['X-User-Id'] = user.id;
    }
  }
  if (config.data && config.data.content) {
    config.data.content = DOMPurify.sanitize(config.data.content);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

axiosRetry(api, {
  retries: 3,
  retryCondition: (error) => error.response?.status >= 500,
});
export const getChatHistory = (chatId, isGroup, page = 0, size = 50, sort = 'asc') => {
  return api.get('/chat/history', { params: { chatId, isGroup, page, size, sort } });
};

export const getLastMessage = (chatId, isGroup) => {
  return getChatHistory(chatId, isGroup, 0, 1, 'desc');
};

export const sendMessage = (message) => api.post('/chat/send', message);

export const getAllUsers = () => api.get('/users/');
export const getUserById = (userId) => api.get(`/users/${userId}`);
export const getOnlineUsers = () => api.get('/users/online');
export const updateUserStatus = (userId, online) => api.put(`/users/${userId}/status`, null, { params: { online } });
export const searchUsers = (query) => api.get('/users/search', { params: { query } });

export const register = (userData, profilePhoto) => {
  const formData = new FormData();
  // Wrap the JSON in a Blob to specify content-type for the part
  formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
  if (profilePhoto) formData.append('profilePhoto', profilePhoto);
  // Remove manual headers to let Axios set them automatically
  return api.post('/auth/register', formData);
};

export const login = (username, password) =>
  api.post('/auth/login', { username, password });

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const createGroup = (group) => api.post('/groups/', group);
export const getUserGroups = (userId) => api.get(`/groups/user/${userId}`);
export const addGroupMember = (groupId, userId) => api.put(`/groups/${groupId}/members`, null, { params: { userId } });

export const createStatus = (status) => api.post('/status/', status);
export const getFriendStatuses = (userId) => api.get(`/status/friends/${userId}`);
export const markStatusViewed = (statusId, userId) => api.post(`/status/${statusId}/view`, null, { params: { userId } });
// Add to api.js
export const addFriend = (userId, friendId) => api.post(`/users/${userId}/friends/${friendId}`);
export const removeFriend = (userId, friendId) => api.delete(`/users/${userId}/friends/${friendId}`);
export const getFriends = (userId) => api.get(`/users/${userId}/friends`);*/


import axios from 'axios';
import axiosRetry from 'axios-retry';
import DOMPurify from 'dompurify';  // Install: npm install dompurify

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  if (!config.url.includes('/auth/')) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      config.headers['X-User-Id'] = user.id;
    }
  }
  if (config.data && config.data.content) {
    config.data.content = DOMPurify.sanitize(config.data.content);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

axiosRetry(api, {
  retries: 3,
  retryCondition: (error) => error.response?.status >= 500,
});
export const getChatHistory = (chatId, isGroup, page = 0, size = 50, sort = 'asc') => {
  return api.get('/chat/history', { params: { chatId, isGroup, page, size, sort } });
};

export const getLastMessage = (chatId, isGroup) => {
  return getChatHistory(chatId, isGroup, 0, 1, 'desc');
};

export const sendMessage = (message) => api.post('/chat/send', message);

export const getAllUsers = () => api.get('/users/');
export const getUserById = (userId) => api.get(`/users/${userId}`);
export const getOnlineUsers = () => api.get('/users/online');
export const updateUserStatus = (userId, online) => api.put(`/users/${userId}/status`, null, { params: { online } });
export const searchUsers = (query) => api.get('/users/search', { params: { query } });

export const register = (userData, profilePhoto) => {
  const formData = new FormData();
  // Wrap the JSON in a Blob to specify content-type for the part
  formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
  if (profilePhoto) formData.append('profilePhoto', profilePhoto);
  // Remove manual headers to let Axios set them automatically
  return api.post('/auth/register', formData);
};

export const login = (username, password) =>
  api.post('/auth/login', { username, password });

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const createGroup = (group) => api.post('/groups/', group);
export const getUserGroups = (userId) => api.get(`/groups/user/${userId}`);
export const addGroupMember = (groupId, userId) => api.put(`/groups/${groupId}/members`, null, { params: { userId } });

export const createStatus = (status) => api.post('/status/', status);
export const getFriendStatuses = (userId) => api.get(`/status/friends/${userId}`);
export const markStatusViewed = (statusId, userId) => api.post(`/status/${statusId}/view`, null, { params: { userId } });
// Add to api.js
export const addFriend = (userId, friendId) => api.post(`/users/${userId}/friends/${friendId}`);
export const removeFriend = (userId, friendId) => api.delete(`/users/${userId}/friends/${friendId}`);
export const getFriends = (userId) => api.get(`/users/${userId}/friends`);
