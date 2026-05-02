import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  getConversationMessages,
  getConversations,
  sendMessage,
} from '../services/chatService';

function Chat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedConversation?.id) {
      setMessages([]);
      return undefined;
    }

    fetchMessages(selectedConversation.id);
    const intervalId = setInterval(() => {
      fetchMessages(selectedConversation.id, false);
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedConversation?.id]);

  const fetchMessages = async (conversationId, showLoader = true) => {
    try {
      if (showLoader) setLoadingMessages(true);
      const data = await getConversationMessages(conversationId);
      setMessages(Array.isArray(data?.messages) ? data.messages : []);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    } finally {
      if (showLoader) setLoadingMessages(false);
    }
  };

  const sendCurrentMessage = async () => {
    const content = newMessage.trim();
    if (!content || !selectedConversation?.id || sending) return;

    try {
      setSending(true);
      await sendMessage(selectedConversation.id, content);
      setNewMessage('');
      await fetchMessages(selectedConversation.id, false);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const currentOtherParticipant = useMemo(() => {
    if (!selectedConversation?.participants) return null;
    return selectedConversation.participants.find((p) => p.id !== user?.id) || null;
  }, [selectedConversation, user?.id]);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <h1 style={styles.title}>Chat</h1>

        <div style={styles.layout}>
          <div style={styles.sidebar}>
            {loading && <p style={styles.metaText}>Loading conversations...</p>}
            {!loading && conversations.length === 0 && (
              <p style={styles.metaText}>No conversations yet.</p>
            )}

            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                style={{
                  ...styles.conversationCard,
                  borderColor: selectedConversation?.id === conversation.id ? '#1a73e8' : '#e5e7eb',
                }}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div style={styles.cardTitle}>
                  {conversation.item_title || `Conversation #${conversation.id}`}
                </div>
                <div style={styles.cardMeta}>
                  {(conversation.participants || [])
                    .filter((p) => p.id !== user?.id)
                    .map((p) => p.username)
                    .join(', ')}
                </div>
              </button>
            ))}
          </div>

          <div style={styles.chatPane}>
            {!selectedConversation && (
              <p style={styles.metaText}>Select a conversation to start chatting.</p>
            )}

            {selectedConversation && (
              <>
                <div style={styles.chatHeader}>
                  <div>
                    <div style={styles.chatTitle}>
                      {selectedConversation.item_title || 'Conversation'}
                    </div>
                    <div style={styles.chatSubTitle}>
                      Chatting with {currentOtherParticipant?.username || 'participant'}
                    </div>
                  </div>
                  <span style={{ ...styles.statusPill, background: '#1a73e8' }}>
                    Polling Every 3s
                  </span>
                </div>

                <div style={styles.messagesBox}>
                  {loadingMessages && <p style={styles.metaText}>Loading messages...</p>}
                  {!loadingMessages && messages.length === 0 && (
                    <p style={styles.metaText}>No messages yet.</p>
                  )}

                  {messages.map((msg) => {
                    const mine = msg?.sender?.id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        style={{
                          ...styles.messageWrapper,
                          justifyContent: mine ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            ...styles.messageBubble,
                            background: mine ? '#1a73e8' : '#f0f2f5',
                            color: mine ? '#ffffff' : '#111827',
                            borderRadius: mine
                              ? '18px 18px 4px 18px'
                              : '18px 18px 18px 4px',
                          }}
                        >
                          {!mine && (
                            <div style={styles.messageSender}>
                              {msg?.sender?.username || 'User'}
                            </div>
                          )}
                          <div>{msg.content}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={styles.inputRow}>
                  <input
                    type="text"
                    style={styles.input}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendCurrentMessage()}
                  />
                  <button
                    style={styles.sendBtn}
                    onClick={sendCurrentMessage}
                    disabled={sending}
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f0f2f5',
  },
  content: {
    padding: '24px 32px',
  },
  title: {
    margin: '0 0 16px',
    color: '#111827',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '14px',
    minHeight: '70vh',
  },
  sidebar: {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    background: '#fff',
    padding: '10px',
    overflowY: 'auto',
  },
  chatPane: {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    background: '#fff',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
  },
  chatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '10px',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '4px',
  },
  chatTitle: {
    fontWeight: '700',
    color: '#111827',
  },
  chatSubTitle: {
    fontSize: '12px',
    color: '#6b7280',
  },
  statusPill: {
    color: '#fff',
    borderRadius: '999px',
    padding: '4px 10px',
    fontSize: '12px',
    textTransform: 'capitalize',
  },
  messagesBox: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px 8px',
  },
  messageWrapper: {
    display: 'flex',
    width: '100%',
  },
  messageBubble: {
    maxWidth: '65%',
    padding: '10px 14px',
    fontSize: '14px',
    lineHeight: '1.5',
    wordBreak: 'break-word',
  },
  messageSender: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#1a73e8',
    marginBottom: '4px',
  },
  inputRow: {
    display: 'flex',
    gap: '8px',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '10px',
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
    padding: '8px 14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  metaText: {
    color: '#6b7280',
    margin: '0 0 16px',
  },
  conversationCard: {
    textAlign: 'left',
    border: '1px solid #e5e7eb',
    background: '#fff',
    borderRadius: '10px',
    padding: '14px',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '8px',
  },
  cardTitle: {
    fontWeight: '700',
    marginBottom: '6px',
    color: '#111827',
  },
  cardMeta: {
    fontSize: '13px',
    color: '#4b5563',
  },
};

export default Chat;