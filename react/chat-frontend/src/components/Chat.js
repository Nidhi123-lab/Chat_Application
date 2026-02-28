/*import React, { useEffect, useState, useRef } from 'react';
import { sendMessage as apiSendMessage, uploadFile, getChatHistory } from '../api';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function Chat({ user, chatId, isGroupChat, allUsers = [] }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [error, setError] = useState('');
  const [chatInfo, setChatInfo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!chatId || !user) {
      setChatInfo(null);
      setLoading(false);
      return;
    }

    const loadChatInfo = async () => {
      try {
        if (isGroupChat) {
          setChatInfo({ type: 'group', name: 'Group Chat', icon: null });
        } else {
          const participants = chatId.split('_');
          const otherUserId = participants.find(id => id !== user.id);
          const otherUser = allUsers.find(u => u.id === otherUserId);
          if (otherUser) {
            setChatInfo({ type: 'user', name: otherUser.username, photo: otherUser.profilePhotoUrl });
          }
        }
      } catch (err) {
        console.error('Failed to load chat info:', err);
      }
    };
    loadChatInfo();

    const loadHistory = async () => {
      try {
        const res = await getChatHistory(chatId, isGroupChat);
        setMessages(res.data || []);
        setError('');
      } catch (err) {
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    loadHistory();

    const socket = new SockJS('http://localhost:8080/ws');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { 'X-User-Id': user.id },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log('STOMP:', str),
      onConnect: () => {
        console.log('WebSocket connected');
        if (isGroupChat) {
          stompClient.current.subscribe(`/topic/group/${chatId}`, (msg) => {
            const message = JSON.parse(msg.body);
            setMessages((prev) => {
              if (prev.some(m => m.id === message.id)) return prev;
              return [...prev, message];
            });
          });
        } else {
          stompClient.current.subscribe(`/user/queue/private`, (msg) => {
            const message = JSON.parse(msg.body);
            if (message.chatId === chatId) {
              setMessages((prev) => {
                if (prev.some(m => m.id === message.id)) return prev;
                return [...prev, message];
              });
            }
          });
        }
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        setError('WebSocket connection failed: ' + (frame.headers?.message || 'Unknown error'));
      },
      onWebSocketClose: () => console.log('WS closed, will reconnect'),
    });
    stompClient.current.activate();

    return () => {
      if (stompClient.current) stompClient.current.deactivate();
      setMessages([]);
      setChatInfo(null);
      setSelectedFile(null);
      setAudioBlob(null);
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    };
  }, [chatId, isGroupChat, user, allUsers]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      alert('File too large. Max 10MB.');
      return;
    }
    setSelectedFile(file);
  };

  const handleFileSend = async () => {
    if (!selectedFile || isSending) return;
    setIsSending(true);
    try {
      const uploadRes = await uploadFile(selectedFile);
      const fileInfo = uploadRes.data;
      const msg = {
        type: selectedFile.type.startsWith('image/') ? 'IMAGE' : 'FILE',
        content: selectedFile.name,
        senderId: user.id,
        senderName: user.username,
        chatId,
        isGroupMessage: isGroupChat,
        viewed: false,
        delivered: false,
        fileUrl: fileInfo.url,
        fileType: fileInfo.fileType,
        fileSize: fileInfo.size,
        thumbnailUrl: selectedFile.type.startsWith('image/') ? fileInfo.url : null,
      };
      await apiSendMessage(msg);
      setMessages((prev) => [...prev, msg]);
      setSelectedFile(null);
      fileInputRef.current.value = '';
    } catch (error) {
      alert('File upload failed');
    } finally {
      setIsSending(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') stopRecording();
      }, 60000);
    } catch (error) {
      alert('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceSend = async () => {
    if (!audioBlob || isSending) return;
    setIsSending(true);
    try {
      const voiceFile = new File([audioBlob], `voice_${Date.now()}.webm`, { type: 'audio/webm' });
      const uploadRes = await uploadFile(voiceFile);
      const fileInfo = uploadRes.data;
      const audio = new Audio(URL.createObjectURL(audioBlob));
      const duration = await new Promise((resolve) => {
        audio.onloadedmetadata = () => resolve(audio.duration);
      });
      const msg = {
        type: 'VOICE',
        content: 'Voice message',
        senderId: user.id,
        senderName: user.username,
        chatId,
        isGroupMessage: isGroupChat,
        viewed: false,
        delivered: false,
        fileUrl: fileInfo.url,
        fileType: fileInfo.fileType,
        fileSize: fileInfo.size,
        duration: Math.floor(duration),
      };
      await apiSendMessage(msg);
      setMessages((prev) => [...prev, msg]);
      setAudioBlob(null);
    } catch (error) {
      alert('Voice upload failed');
    } finally {
      setIsSending(false);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || isSending) return;
    const msg = {
      type: 'TEXT',
      content: messageInput,
      senderId: user.id,
      senderName: user.username,
      chatId,
      isGroupMessage: isGroupChat,
      viewed: false,
      delivered: false,
    };
    console.log('isGroupChat prop:', isGroupChat);
    console.log('Sending message payload:', JSON.stringify(msg));
    if (isGroupChat && !chatId) {
      alert('Error: No chatId for group message');
      return;
    }
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const tempMsg = { ...msg, id: tempId, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, tempMsg]);
    try {
      const res = await apiSendMessage(msg);
      setMessages((prev) => prev.map(m => m.id === tempId ? res.data : m));
      setMessageInput('');
    } catch (error) {
      setMessages((prev) => prev.filter(m => m.id !== tempId));
      setError('Message failed to send');
    } finally {
      setIsSending(false);
    }
  };

  if (!chatId) return <p>Select a chat to start messaging.</p>;
  if (loading) return <div className="text-center mt-5">Loading chat...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {chatInfo && (
        <div style={{
          padding: "10px",
          borderBottom: "1px solid #ccc",
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center"
        }}>
          {chatInfo.photo && (
            <img
              src={`http://localhost:8080${chatInfo.photo}`}
              alt="Profile"
              style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10 }}
            />
          )}
          {chatInfo.icon && (
            <img
              src={`http://localhost:8080${chatInfo.icon}`}
              alt="Group Icon"
              style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10 }}
            />
          )}
          <h5 style={{ margin: 0 }}>{chatInfo.name}</h5>
        </div>
      )}

      {error && <p style={{ color: 'red', padding: 10 }}>{error}</p>}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 10,
          border: "1px solid #ccc",
          marginBottom: 10,
          backgroundColor: "#e5ddd5",
          minHeight: "200px",
          maxHeight: "calc(100vh - 200px)",
        }}
      >
        {messages.length === 0 && <p style={{ textAlign: 'center', color: '#999' }}>No messages yet.</p>}
        {messages
          .filter((m, index, arr) => arr.findIndex(msg => msg.id === m.id) === index)
          .map((m) => (
            <div
              key={m.id || `${m.timestamp || Date.now()}-${m.senderId}-${Math.random()}`}
              style={{
                display: 'flex',
                justifyContent: m.senderId === user.id ? 'flex-end' : 'flex-start',
                margin: '5px 0',
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '8px 12px',
                  borderRadius: '18px',
                  backgroundColor: m.senderId === user.id ? '#dcf8c6' : '#fff',
                  border: m.senderId === user.id ? 'none' : '1px solid #e0e0e0',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  wordWrap: 'break-word',
                }}
              >
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>{m.content}</div>
                {m.fileUrl && (
                  <div style={{ marginTop: 5 }}>
                    {m.type === 'IMAGE' ? (
                      <img
                        src={`http://localhost:8080${m.fileUrl}`}
                        alt={m.content}
                        style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 5 }}
                      />
                    ) : m.type === 'VOICE' ? (
                      <audio controls style={{ maxWidth: '100%' }}>
                        <source src={`http://localhost:8080${m.fileUrl}`} type={m.fileType} />
                        Your browser does not support audio playback.
                      </audio>
                    ) : (
                      <a
                        href={`http://localhost:8080${m.fileUrl}`}
                        download={m.content}
                        style={{ color: '#007bff', textDecoration: 'underline', fontSize: '12px' }}
                      >
                        Download {m.content} ({(m.fileSize / 1024).toFixed(1)} KB)
                      </a>
                    )}
                  </div>
                )}
                <div style={{ fontSize: '11px', color: '#999', textAlign: 'right', marginTop: '4px' }}>
                  {m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : 'Unknown time'}
                </div>
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', padding: 10, backgroundColor: '#f0f0f0' }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        <span
          style={{ cursor: 'pointer', marginRight: 10, fontSize: 20 }}
          onClick={() => fileInputRef.current.click()}
          title="Attach file"
        >
          📎
        </span>
        <span
          style={{ cursor: 'pointer', marginRight: 10, fontSize: 20 }}
          onClick={isRecording ? stopRecording : startRecording}
          title={isRecording ? "Stop recording" : "Record voice note"}
        >
          {isRecording ? "🔴" : "🎤"}
        </span>
        <input
          style={{ flex: 1, padding: 8, borderRadius: 20, border: 'none', outline: 'none' }}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type a message"
          disabled={isSending}
        />
        <button onClick={sendMessage} style={{ padding: "8px 16px", marginLeft: 5, borderRadius: 50, backgroundColor: '#25d366', color: '#fff', border: 'none' }} disabled={isSending}>
          {isSending ? "..." : "➤"}
        </button>
        {selectedFile && (
          <button onClick={handleFileSend} style={{ padding: "8px 16px", marginLeft: 5 }} disabled={isSending}>
            Send File
          </button>
        )}
        {audioBlob && (
          <button onClick={handleVoiceSend} style={{ padding: "8px 16px", marginLeft: 5 }} disabled={isSending}>
            Send Voice
          </button>
        )}
      </div>
    </div>
  );
}*/

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { sendMessage as apiSendMessage, uploadFile, getChatHistory } from '../api';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { FaArrowRight } from 'react-icons/fa';  // WhatsApp-like arrow send icon

export default function Chat({ user, chatId, isGroupChat, allUsers = [] }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [error, setError] = useState('');
  const [chatInfo, setChatInfo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const stompClient = useRef(null);

  useEffect(() => {
    if (!chatId || !user) {
      setChatInfo(null);
      setLoading(false);
      return;
    }

    const loadChatInfo = async () => {
      try {
        if (isGroupChat) {
          setChatInfo({ type: 'group', name: 'Group Chat', icon: null });
        } else {
          const participants = chatId.split('_');
          const otherUserId = participants.find(id => id !== user.id);
          const otherUser = allUsers.find(u => u.id === otherUserId);
          if (otherUser) {
            setChatInfo({ type: 'user', name: otherUser.username, photo: otherUser.profilePhotoUrl });
          }
        }
      } catch (err) {
        console.error('Failed to load chat info:', err);
      }
    };
    loadChatInfo();

    const loadHistory = async () => {
      try {
        const res = await getChatHistory(chatId, isGroupChat);
        setMessages(res.data || []);
        setError('');
      } catch (err) {
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    loadHistory();

    const socket = new SockJS('http://localhost:8080/ws');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { 'X-User-Id': user.id },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log('STOMP:', str),
      onConnect: () => {
        console.log('WebSocket connected');
        if (isGroupChat) {
          stompClient.current.subscribe(`/topic/group/${chatId}`, (msg) => {
            const message = JSON.parse(msg.body);
            setMessages((prev) => {
              if (prev.some(m => m.id === message.id)) return prev;
              return [...prev, message];
            });
          });
        } else {
          stompClient.current.subscribe(`/user/queue/private`, (msg) => {
            const message = JSON.parse(msg.body);
            if (message.chatId === chatId) {
              setMessages((prev) => {
                if (prev.some(m => m.id === message.id)) return prev;
                return [...prev, message];
              });
            }
          });
        }
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        setError('WebSocket connection failed: ' + (frame.headers?.message || 'Unknown error'));
      },
      onWebSocketClose: () => console.log('WS closed, will reconnect'),
    });
    stompClient.current.activate();

    return () => {
      if (stompClient.current) stompClient.current.deactivate();
      setMessages([]);
      setChatInfo(null);
      setSelectedFile(null);
      setAudioBlob(null);
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    };
  }, [chatId, isGroupChat, user, allUsers]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      alert('File too large. Max 10MB.');
      return;
    }
    setSelectedFile(file);
  };

  const handleFileSend = async () => {
    if (!selectedFile || isSending) return;
    setIsSending(true);
    try {
      const uploadRes = await uploadFile(selectedFile);
      const fileInfo = uploadRes.data;
      const msg = {
        type: selectedFile.type.startsWith('image/') ? 'IMAGE' : 'FILE',
        content: selectedFile.name,
        senderId: user.id,
        senderName: user.username,
        chatId,
        isGroupMessage: isGroupChat,
        viewed: false,
        delivered: false,
        fileUrl: fileInfo.url,
        fileType: fileInfo.fileType,
        fileSize: fileInfo.size,
        thumbnailUrl: selectedFile.type.startsWith('image/') ? fileInfo.url : null,
      };
      await apiSendMessage(msg);
      setMessages((prev) => [...prev, msg]);
      setSelectedFile(null);
      fileInputRef.current.value = '';
    } catch (error) {
      alert('File upload failed');
    } finally {
      setIsSending(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') stopRecording();
      }, 60000);
    } catch (error) {
      alert('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceSend = async () => {
    if (!audioBlob || isSending) return;
    setIsSending(true);
    try {
      const voiceFile = new File([audioBlob], `voice_${Date.now()}.webm`, { type: 'audio/webm' });
      const uploadRes = await uploadFile(voiceFile);
      const fileInfo = uploadRes.data;
      const audio = new Audio(URL.createObjectURL(audioBlob));
      const duration = await new Promise((resolve) => {
        audio.onloadedmetadata = () => resolve(audio.duration);
      });
      const msg = {
        type: 'VOICE',
        content: 'Voice message',
        senderId: user.id,
        senderName: user.username,
        chatId,
        isGroupMessage: isGroupChat,
        viewed: false,
        delivered: false,
        fileUrl: fileInfo.url,
        fileType: fileInfo.fileType,
        fileSize: fileInfo.size,
        duration: Math.floor(duration),
      };
      await apiSendMessage(msg);
      setMessages((prev) => [...prev, msg]);
      setAudioBlob(null);
    } catch (error) {
      alert('Voice upload failed');
    } finally {
      setIsSending(false);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || isSending) return;
    const msg = {
      type: 'TEXT',
      content: messageInput,
      senderId: user.id,
      senderName: user.username,
      chatId,
      isGroupMessage: isGroupChat,
      viewed: false,
      delivered: false,
    };
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const tempMsg = { ...msg, id: tempId, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, tempMsg]);
    try {
      const res = await apiSendMessage(msg);
      setMessages((prev) => prev.map(m => m.id === tempId ? res.data : m));
      setMessageInput('');
    } catch (error) {
      setMessages((prev) => prev.filter(m => m.id !== tempId));
      setError('Message failed to send');
    } finally {
      setIsSending(false);
    }
  };

  if (!chatId) return <p>Select a chat to start messaging.</p>;
  if (loading) return <div className="text-center mt-5">Loading chat...</div>;

  return (
   <div style={{ display: "flex", flexDirection: "column", height:"100%" }}>
      {chatInfo && (
        <div style={{
          padding: "10px",
          borderBottom: "1px solid #ccc",
          backgroundColor: "#f0e5e5ff",
          display: "flex",
          alignItems: "center"
        }}>

          {chatInfo.photo && (
            <img
              src={`http://localhost:8080${chatInfo.photo}`}
              alt="Profile"
              style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10 }}
            />
          )}
          {chatInfo.icon && (
            <img
              src={`http://localhost:8080${chatInfo.icon}`}
              alt="Group Icon"
              style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10 }}
            />
          )}
          <h5 style={{ margin: 0 }}>{chatInfo.name}</h5>
        </div>
      )}

      {error && <p style={{ color: 'red', padding: 10 }}>{error}</p>}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 10,
          border: "1px solid #ccc",
          marginBottom: 10,
          backgroundColor: "#f9f9f9",
          borderRadius: '10px',
        }}
      >
        {messages.length === 0 && <p>No messages yet.</p>}
        {messages
          .filter((m, index, arr) => arr.findIndex(msg => msg.id === m.id) === index)
          .map((m) => (
            <div
              key={m.id || `${m.timestamp || Date.now()}-${m.senderId}-${Math.random()}`}
              style={{
                textAlign: m.senderId === user.id ? "right" : "left",
                margin: "5px 0",
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  padding: '10px',
                  borderRadius: m.senderId === user.id ? '10px 10px 0 10px' : '10px 10px 10px 0',
                  backgroundColor: m.senderId === user.id ? '#DCF8C6' : '#FFFFFF',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  maxWidth: '70%',
                }}
              >
                <b>{m.senderName}</b>: {m.content}
                {m.fileUrl && (
                  <div style={{ marginTop: 5 }}>
                    {m.type === 'IMAGE' ? (
                      <img
                        src={`http://localhost:8080${m.fileUrl}`}
                        alt={m.content}
                        style={{ maxWidth: 200, maxHeight: 200, borderRadius: 5 }}
                      />
                    ) : m.type === 'VOICE' ? (
                      <audio controls style={{ maxWidth: 200 }}>
                        <source src={`http://localhost:8080${m.fileUrl}`} type={m.fileType} />
                        Your browser does not support audio playback.
                      </audio>
                    ) : (
                      <a
                        href={`http://localhost:8080${m.fileUrl}`}
                        download={m.content}
                        style={{ color: 'blue', textDecoration: 'underline' }}
                      >
                        Download {m.content} ({(m.fileSize / 1024).toFixed(1)} KB)
                      </a>
                    )}
                  </div>
                )}
                <br />
                <small style={{ color: '#888' }}>{new Date(m.timestamp).toLocaleTimeString()}</small>
              </div>
            </div>
          ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '0 0 10px 10px', borderTop: '1px solid #ccc', boxShadow: '0 -2px 5px rgba(0,0,0,0.1)' }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        <button
          style={{ background: 'none', border: 'none', fontSize: '20px', marginRight: '10px', cursor: 'pointer', color: '#25D366' }}
          onClick={() => fileInputRef.current.click()}
          title="Attach file"
        >
          📎
        </button>
        <button
          style={{ background: 'none', border: 'none', fontSize: '20px', marginRight: '10px', cursor: 'pointer', color: isRecording ? '#FF0000' : '#25D366' }}
          onClick={isRecording ? stopRecording : startRecording}
          title={isRecording ? "Stop recording" : "Record voice note"}
        >
          {isRecording ? "🔴" : "🎤"}
        </button>
        <input
          style={{ flex: 1, padding: '12px 15px', borderRadius: '25px', border: '1px solid #ccc', outline: 'none', marginRight: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type a message"
          disabled={isSending}
        />
        <button 
          onClick={sendMessage} 
          style={{ 
            padding: '12px', 
            backgroundColor: '#25D366', 
            color: 'white', 
            border: 'none', 
            borderRadius: '50%', 
            cursor: 'pointer',
            fontSize: '18px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} 
          disabled={isSending}
          title="Send message"
        >
          <FaArrowRight />
        </button>
        {selectedFile && (
          <button onClick={handleFileSend} style={{ padding: "8px 16px", marginLeft: 5, backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '10px' }} disabled={isSending}>
            Send File
          </button>
        )}
        {audioBlob && (
          <button onClick={handleVoiceSend} style={{ padding: "8px 16px", marginLeft: 5, backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '10px' }} disabled={isSending}>
            Send Voice
          </button>
        )}
      </div>
    </div>
  );
}
