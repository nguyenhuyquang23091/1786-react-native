import { useCallback, useEffect, useState } from 'react';
import { ChatMessageService } from '../service/chatMessageService';
import { auth } from '@/service/firebaseConfig';
import { IMessage } from 'react-native-gifted-chat';

export function useChatMessages(conversationId: string | null, adminEmail?: string | null) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [currentAdminEmail, setCurrentAdminEmail] = useState<string | null>(adminEmail || null);

  const chatService = new ChatMessageService();

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    setLoading(true);
    setError(null);
    setIsConnected(true);

    // Set admin email if provided
    if (adminEmail && !currentAdminEmail) {
      setCurrentAdminEmail(adminEmail);
    }

    const unsubscribe = chatService.subscribeToMessages(
      conversationId,
      (newMessages) => {
        setMessages(newMessages);
        setLoading(false);
        setIsConnected(true);
        setIsReconnecting(false);
      },
      (error) => {
        console.error('Chat subscription error:', error);
        setIsConnected(false);
        setError('Connection lost. Trying to reconnect...');
        setIsReconnecting(true);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [conversationId, adminEmail]);

  const sendMessage = useCallback(
    async (message: IMessage) => {
      if (!conversationId) return;

      try {
        setError(null);
        await chatService.sendMessage(conversationId, message);
      } catch (err) {
        setError('Failed to send message');
        console.error('Send message error:', err);
        throw err;
      }
    },
    [conversationId]
  );

  const retryConnection = useCallback(() => {
    if (conversationId) {
      setError(null);
      setIsReconnecting(true);
      // Re-trigger the effect to reconnect
      setMessages([]);
    }
  }, [conversationId]);

  return {
    messages,
    loading,
    error,
    isConnected,
    isReconnecting,
    sendMessage,
    retryConnection,
    adminEmail: currentAdminEmail,
  };
}