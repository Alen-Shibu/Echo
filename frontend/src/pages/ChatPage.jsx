import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import "./chatPage.css";


const Avatar = ({name}) => {
  const initials = name ? name.split(" ").map((part) => part[0]?.toUpperCase()).slice(0,2).join("") : "U" ;
  /* ex: name(It is a prop thats why in {}) = alen shibu mathew
        .split = ["alen","shibu","mathew"]
        .map = ["A","S","M"]
        .slice = ["A","S"]
        .join = "AS"
  */
  return <div className="chat-avatar">{initials}</div>
}

const ChatListItem = ({ user, active, onSelect }) => (
  <button className={`chat-list-item ${active ? "active" : ""}`} onClick={() => onSelect(user)}>
    <Avatar name={user.name || user.userName || user.email} />
    <div className="chat-list-text">
      <strong>{user.userName || user.name || "Unknown"}</strong>
      <span>{user.email || "No email"}</span>
    </div>
  </button>
);

const MessageBubble = ({ message, isMe }) => (
  <div className={`message-bubble ${isMe ? "me" : "them"}`}>
    <p>{message.text || "(Photo)"}</p>
    <span>{new Date(message.createdAt).toLocaleTimeString(["en-IN"], { hour: "2-digit", minute: "2-digit" })}</span>
  </div>
); 

const ChatInput = ({ value, onChange, onSend, disabled }) => (
  <form className="chat-input-box" onSubmit={onSend}>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your message..."
      disabled={disabled}
    />
    <button type="submit" disabled={disabled || !value.trim()}>
      Send
    </button>
  </form>
);

const ChatPage = () => {
  const navigate = useNavigate();
  const { authUser, logout  } = useAuthStore();
  const {
    contacts,
    chats,
    messages,
    selectedUser,
    activeTab,
    isUsersLoading,
    isMessagesLoading,
    setActiveTab,
    setSelectedUser,
    getAllContacts,
    getAllChats,
    getAllMessages,
    sendMessage,
  } = useChatStore();

  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
      return;
    }
    getAllContacts();
    getAllChats();
  }, [authUser, navigate, getAllChats, getAllContacts]);

  useEffect(() => {
    if (selectedUser?.id || selectedUser?._id) {
      getAllMessages(selectedUser._id || selectedUser.id);
    }
  }, [selectedUser, getAllMessages]);

  const selectedList = activeTab === "chats" ? chats : contacts;

  const activeRecipient = selectedUser?.userName || selectedUser?.name || "Select a contact";

  const onSend = async (e) => {
    e.preventDefault();
    if (!selectedUser || !draft.trim()) return;

    setIsSending(true);
    try {
      await sendMessage(selectedUser._id || selectedUser.id, draft.trim());
      setDraft("");
    } catch (error) {
      // errors handled in store toast
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-wrapper">
      <aside className="chat-sidebar">
        <header className="sidebar-header">
          <h2>{authUser?.userName || authUser?.email || "Chat"}</h2>
              <button className="logout-btn" onClick={logout} title="Logout">
                  ⎋
              </button>
        </header>

        <div className="tab-row">
          <button className={activeTab === "chats" ? "active" : ""} onClick={() => setActiveTab("chats")}>Chats</button>
          <button className={activeTab === "contacts" ? "active" : ""} onClick={() => setActiveTab("contacts")}>Contacts</button>
        </div>

        <div className="chat-list">
          {isUsersLoading ? (
            <div className="side-loading">Loading users...</div>
          ) : selectedList.length > 0 ? (
            selectedList.map((user) => (
              <ChatListItem
                key={user._id || user.id || user.email}
                user={user}
                active={(selectedUser?._id || selectedUser?.id) === (user._id || user.id)}
                onSelect={setSelectedUser}
              />
            ))
          ) : (
            <div className="side-empty">No {activeTab} yet</div>
          )}
        </div>
      </aside>

      <main className="chat-main">
        <div className="chat-main-header">
          <h3>{activeRecipient}</h3>
          <span>{selectedUser ? "Active now" : "Pick someone to start"}</span>
        </div>

        <div className="messages-wrap">
          {isMessagesLoading ? (
            <div className="messages-loading">Loading messages...</div>
          ) : messages.length ? (
            messages.map((message,index) => (
              <MessageBubble
                key={message._id || message.id || index}
                message={message}
                isMe={message.senderId === authUser?._id}
              />
            ))
          ) : (
            <div className="empty-messages">No conversation yet. Say hello 👋</div>
          )}
        </div>

        <ChatInput value={draft} onChange={setDraft} onSend={onSend} disabled={!selectedUser || isSending} />
      </main>
    </div>
  );
};

export default ChatPage;

