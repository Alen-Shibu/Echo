// frontend/src/pages/ChatPage.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useSocketStore } from "../store/useSocketStore";
import { 
  Send, LogOut, Users, MessageSquare, Menu, X,
  Search, Smile, Paperclip, CheckCheck
} from "lucide-react";
import EmojiPicker from 'emoji-picker-react';
import "./chatPage.css";

const Avatar = ({ name, size = "normal" }) => {
  const initials = name ? name.slice(0, 2).toUpperCase() : "?";
  return <div className={`chat-avatar ${size}`}>{initials}</div>;
};

// ✅ ChatListItem now receives isOnline prop and shows the green dot
const ChatListItem = ({ user, active, onSelect, isOnline }) => (
  <button className={`chat-list-item ${active ? "active" : ""}`} onClick={() => onSelect(user)}>
    <div style={{ position: "relative" }}>
      <Avatar name={user.userName || user.name || user.email} size="small" />
      {isOnline && <span className="online-dot" />}
    </div>
    <div className="chat-list-text">
      <div className="chat-list-header">
        <strong>{user.userName || user.name || "Unknown"}</strong>
        {isOnline && (
          <span style={{ fontSize: "0.65rem", color: "var(--success)" }}>● online</span>
        )}
      </div>
      <div className="chat-list-footer">
        <span className="last-message">{user.email || "No email"}</span>
      </div>
    </div>
  </button>
);

const MessageBubble = ({ message, isMe }) => (
  <div className={`message-wrapper ${isMe ? "me" : "them"}`}>
    <div className={`message-bubble ${isMe ? "me" : "them"}`}>
      {message.image && <img src={message.image} alt="shared" className="message-image" />}
      {message.text && <p>{message.text}</p>}
      <div className="message-meta">
        <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        {isMe && <CheckCheck size={14} className="read-receipt" />}
      </div>
    </div>
  </div>
);

const ChatPage = () => {
  const navigate = useNavigate();
  const { authUser, logout, isCheckingAuth } = useAuthStore();
  const {
    contacts, chats, messages, selectedUser, activeTab,
    isUsersLoading, isMessagesLoading,
    setActiveTab, setSelectedUser, getAllMessages,
    sendMessage, initializeChat, reset
  } = useChatStore();

  // ✅ Get socket and onlineUsers from socket store
  const { socket, onlineUsers } = useSocketStore();

  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  // ✅ Typing indicator state
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => { return () => reset(); }, [reset]);

  useEffect(() => {
    if (!authUser) return;
    initializeChat();
  }, [authUser]);

  useEffect(() => {
    if (selectedUser?._id || selectedUser?.id) {
      getAllMessages(selectedUser._id || selectedUser.id);
    }
  }, [selectedUser, getAllMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Listen for incoming messages in real-time
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleNewMessage = (message) => {
      if (message.senderId === (selectedUser._id || selectedUser.id)) {
        useChatStore.setState((state) => ({
          messages: [...state.messages, message]
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedUser]);

  // ✅ Listen for typing events from the other person
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleTyping = ({ from }) => {
      if (from === (selectedUser._id || selectedUser.id)) setIsTyping(true);
    };
    const handleStopTyping = ({ from }) => {
      if (from === (selectedUser._id || selectedUser.id)) setIsTyping(false);
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      setIsTyping(false); // reset when switching chats
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) setShowEmojiPicker(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedList = activeTab === "chats" ? chats : contacts;

  // ✅ Emit typing events when user types
  const handleDraftChange = (e) => {
    setDraft(e.target.value);

    if (!socket || !selectedUser) return;
    socket.emit("typing", { to: selectedUser._id || selectedUser.id });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { to: selectedUser._id || selectedUser.id });
    }, 2000);
  };

  const onSend = async (e) => {
    e.preventDefault();
    if (!selectedUser || (!draft.trim() && !selectedImage)) return;

    // Stop typing indicator when message is sent
    if (socket) {
      socket.emit("stopTyping", { to: selectedUser._id || selectedUser.id });
      clearTimeout(typingTimeoutRef.current);
    }

    setIsSending(true);
    try {
      await sendMessage(selectedUser._id || selectedUser.id, {
        text: draft.trim(),
        image: selectedImage
      });
      setDraft("");
      setSelectedImage(null);
      inputRef.current?.focus();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    reset();
    navigate("/login");
  };

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) setMobileMenuOpen(!mobileMenuOpen);
    else setSidebarOpen(!sidebarOpen);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    if (window.innerWidth <= 768) setMobileMenuOpen(false);
  };

  const onEmojiClick = (emojiObject) => {
    setDraft(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setSelectedImage(reader.result);
    reader.readAsDataURL(file);
  };

  const formatDate = (date) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diffDays = Math.floor((now - msgDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return msgDate.toLocaleDateString([], { weekday: 'short' });
    return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.createdAt);
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {});

  // ✅ Is the currently selected user online?
  const isSelectedUserOnline = selectedUser
    ? onlineUsers.includes(selectedUser._id || selectedUser.id)
    : false;

  if (isCheckingAuth) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!authUser) return null;

  return (
    <div className="chat-app">
      {/* Header */}
      <header className="chat-header">
        <div className="header-left">
          <button className="menu-btn" onClick={toggleSidebar}>
            {(sidebarOpen && window.innerWidth > 768) || mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <div className="header-center">
          {selectedUser && (
            <div className="active-chat-info">
              <h3>{selectedUser.userName || selectedUser.name}</h3>
              {/* ✅ Real online/offline status in header */}
              <span style={{ color: isSelectedUserOnline ? "var(--success)" : "var(--text-tertiary)" }}>
                {isSelectedUserOnline ? "Online" : "Offline"}
              </span>
            </div>
          )}
        </div>
        <div className="header-right">
          <button className="icon-btn" title="Search"><Search size={18} /></button>
          <button className="icon-btn" onClick={handleLogout} title="Logout"><LogOut size={18} /></button>
        </div>
      </header>

      <div className="chat-container">
        {/* Sidebar */}
        <aside className={`chat-sidebar ${sidebarOpen ? "open" : "closed"} ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <div className="sidebar-header">
            <div className="user-info">
              <Avatar name={authUser?.userName || authUser?.email} />
              <div>
                <p className="user-name">{authUser?.userName || "User"}</p>
                <p className="user-email">{authUser?.email}</p>
              </div>
            </div>
          </div>

          <div className="tab-row">
            <button className={`tab-btn ${activeTab === "chats" ? "active" : ""}`} onClick={() => setActiveTab("chats")}>
              <MessageSquare size={16} />
              <span>Chats</span>
              {chats.length > 0 && <span className="tab-count">{chats.length}</span>}
            </button>
            <button className={`tab-btn ${activeTab === "contacts" ? "active" : ""}`} onClick={() => setActiveTab("contacts")}>
              <Users size={16} />
              <span>Contacts</span>
              {contacts.length > 0 && <span className="tab-count">{contacts.length}</span>}
            </button>
          </div>

          <div className="chat-list">
            {isUsersLoading ? (
              <div className="loading-state">
                <div className="loader"></div>
                <p>Loading...</p>
              </div>
            ) : selectedList.length > 0 ? (
              selectedList.map((user) => (
                <ChatListItem
                  key={user._id || user.id}
                  user={user}
                  active={(selectedUser?._id || selectedUser?.id) === (user._id || user.id)}
                  onSelect={handleSelectUser}
                  // ✅ Pass isOnline for each user in the list
                  isOnline={onlineUsers.includes(user._id || user.id)}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <p>No {activeTab} yet</p>
                <small>{activeTab === "chats" ? "Start a conversation with someone" : "No other users found"}</small>
              </div>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="chat-main-area">
          {!selectedUser ? (
            <div className="welcome-screen">
              <div className="welcome-content">
                <div className="welcome-icon">💬</div>
                <h2>Welcome to Echo</h2>
                <p>Select a conversation to start chatting</p>
                {contacts.length > 0 && (
                  <button className="start-chat-btn" onClick={() => { setActiveTab("contacts"); if (contacts[0]) handleSelectUser(contacts[0]); }}>
                    Start a conversation
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="chat-messages">
                {isMessagesLoading ? (
                  <div className="loading-messages">
                    <div className="loader"></div>
                    <p>Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="empty-chat">
                    <div className="empty-chat-icon">💭</div>
                    <p>No messages yet</p>
                    <small>Send a message to start the conversation</small>
                  </div>
                ) : (
                  Object.entries(groupedMessages).map(([date, msgs]) => (
                    <div key={date} className="message-group">
                      <div className="date-divider"><span>{date}</span></div>
                      {msgs.map((message, idx) => (
                        <MessageBubble
                          key={message._id || idx}
                          message={message}
                          isMe={message.senderId === authUser?._id}
                        />
                      ))}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* ✅ Typing indicator — shows above the input */}
              {isTyping && (
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", padding: "0 20px 6px" }}>
                  {selectedUser.userName} is typing...
                </p>
              )}

              {selectedImage && (
                <div className="outer-box">
                  <div className="chatgpt-style-preview">
                    <img src={selectedImage} alt="preview" />
                    <button type="button" className="remove-image-btn" onClick={() => setSelectedImage(null)}>✕</button>
                  </div>
                </div>
              )}

              <form className="chat-input-form" onSubmit={onSend}>
                <div className="input-actions" style={{ position: 'relative' }}>
                  <button type="button" className="attach-btn" title="Attach file" onClick={() => fileInputRef.current.click()}>
                    <Paperclip size={18} />
                  </button>
                  <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageSelect} />
                  <button type="button" className="emoji-btn" title="Add emoji" ref={emojiButtonRef} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <Smile size={18} />
                  </button>
                  {showEmojiPicker && (
                    <div ref={emojiPickerRef} style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: '10px', zIndex: 1000 }}>
                      <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={draft}
                  onChange={handleDraftChange}  // ✅ replaced setDraft with handleDraftChange
                  placeholder="Type a message..."
                  disabled={isSending}
                  className="message-input"
                />
                <button type="submit" disabled={(!draft.trim() && !selectedImage) || isSending} className="send-btn">
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </main>
      </div>

      {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />}
    </div>
  );
};

export default ChatPage;