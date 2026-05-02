import api from './api';

export const getConversations = async () => {
  const response = await api.get('/api/chat/conversations/');
  return response.data;
};

export const getConversationMessages = async (conversationId) => {
  const response = await api.get(`/api/chat/conversations/${conversationId}/messages/`);
  return response.data;
};

export const sendMessage = async (conversationId, content) => {
  const response = await api.post(`/api/chat/conversations/${conversationId}/send/`, { content });
  return response.data;
};

export const getNotifications = async () => {
  const response = await api.get('/api/chat/notifications/');
  return response.data;
};

export const markNotificationRead = async (notificationId) => {
  const response = await api.post(`/api/chat/notifications/${notificationId}/read/`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.post('/api/chat/notifications/read-all/');
  return response.data;
};
export const startConversation = async (itemId, receiverId, message) => {
  const response = await api.post('/api/chat/conversations/start/', {
    item_id: itemId,
    receiver_id: receiverId,
    message: message || 'Hi! I think I found your item.',
  });
  return response.data;
};