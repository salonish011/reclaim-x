import React, { useEffect, useState } from 'react';
import { getConversationMessages, sendMessage } from '../services/chatService';

function ChatBox({ conversation, onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!conversation?.id) return;
    fetchMessages(conversation.id);
  }, [conversation?.id]);

  const fetchMessages = async (conversationId) => {
    try {
      setLoading(true);
      const data = await getConversationMessages(conversationId);
      setMessages(Array.isArray(data?.messages) ? data.messages : []);
    } catch (error) {
      console.error('Failed to load chat messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed || !conversation?.id) return;

    try {
      const sent = await sendMessage(conversation.id, trimmed);
      setMessages((prev) => [...prev, sent]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!conversation) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div>
          <strong>Chat</strong>
          <div style={styles.subTitle}>{conversation.item_title || 'Conversation'}</div>
        </div>
        <button style={styles.closeBtn} onClick={onClose}>x</button>
      </div>

      <div style={styles.messages}>
        {loading && <p style={styles.metaText}>Loading messages...</p>}
        {!loading && messages.length === 0 && (
          <p style={styles.metaText}>No messages yet. Start the conversation.</p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} style={styles.messageBubble}>
            <div style={styles.sender}>{msg.sender?.username || 'User'}</div>
            <div>{msg.content}</div>
          </div>
        ))}
      </div>

      <div style={styles.inputRow}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button style={styles.sendBtn} onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'fixed',
    right: '24px',
    bottom: '24px',
    width: '360px',
    height: '500px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 2000,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    background: '#1a73e8',
    color: '#fff',
  },
  subTitle: {
    fontSize: '12px',
    opacity: 0.9,
    marginTop: '2px',
  },
  closeBtn: {
    border: 'none',
    background: 'transparent',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
  messages: {
    flex: 1,
    padding: '12px',
    overflowY: 'auto',
    background: '#f7f9fc',
  },
  metaText: {
    margin: 0,
    fontSize: '13px',
    color: '#6b7280',
  },
  messageBubble: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '8px 10px',
    marginBottom: '8px',
  },
  sender: {
    fontWeight: '600',
    marginBottom: '4px',
    fontSize: '12px',
    color: '#1a73e8',
  },
  inputRow: {
    display: 'flex',
    gap: '8px',
    padding: '10px',
    borderTop: '1px solid #e5e7eb',
    background: '#fff',
  },
  input: {
    flex: 1,
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '8px 10px',
    outline: 'none',
  },
  sendBtn: {
    border: 'none',
    borderRadius: '8px',
    background: '#1a73e8',
    color: '#fff',
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default ChatBox;
