import { useState, useCallback, useEffect } from 'react';
import { Conversation, ChatMessage } from '@/types';
import { mockConversations, currentUser, mockUsers } from '@/data/mockData';

export type ReactionType = '❤️' | '😂' | '😮' | '😢' | '😡' | '👍';

export interface MessageReaction {
  emoji: ReactionType;
  userId: string;
}

export interface Message {
  id: string;
  text: string;
  isMine: boolean;
  time: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: Message;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  reactions?: MessageReaction[];
  isEdited?: boolean;
  isDeleted?: boolean;
}

interface ConversationMessages {
  [conversationId: string]: Message[];
}

const STORAGE_KEY = 'intymy_chat_messages';

// Generate initial mock messages for each conversation
const generateInitialMessages = (conversationId: string): Message[] => {
  const baseMessages: Record<string, Message[]> = {
    'c1': [
      { id: 'm1', text: 'Oi! Vi que você também curte fotografia 📷', isMine: false, time: new Date(Date.now() - 1000 * 60 * 60 * 2), status: 'read' },
      { id: 'm2', text: 'Sim! É minha paixão', isMine: true, time: new Date(Date.now() - 1000 * 60 * 60 * 1.5), status: 'read' },
      { id: 'm3', text: 'Que legal! Quais equipamentos você usa?', isMine: false, time: new Date(Date.now() - 1000 * 60 * 60), status: 'read' },
      { id: 'm4', text: 'Uso uma Canon R6 com algumas lentes fixas', isMine: true, time: new Date(Date.now() - 1000 * 60 * 45), status: 'read' },
      { id: 'm5', text: 'Amei seu último post 💕', isMine: false, time: new Date(Date.now() - 1000 * 60 * 5), status: 'read' },
    ],
    'c2': [
      { id: 'm1', text: 'Olá! Adoramos o conteúdo de vocês!', isMine: true, time: new Date(Date.now() - 1000 * 60 * 60 * 24), status: 'read' },
      { id: 'm2', text: 'Obrigado! 💜 Significa muito pra gente', isMine: false, time: new Date(Date.now() - 1000 * 60 * 60 * 20), status: 'read' },
      { id: 'm3', text: 'Quando vocês vão postar mais?', isMine: true, time: new Date(Date.now() - 1000 * 60 * 60 * 2), status: 'delivered' },
    ],
    'c3': [
      { id: 'm1', text: 'Cara, sua música nova tá incrível! 🎸', isMine: true, time: new Date(Date.now() - 1000 * 60 * 60 * 48), status: 'read' },
      { id: 'm2', text: 'Valeu pelo apoio! 🙏', isMine: false, time: new Date(Date.now() - 1000 * 60 * 60 * 24), status: 'read' },
    ],
  };
  
  return baseMessages[conversationId] || [];
};

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [conversationMessages, setConversationMessages] = useState<ConversationMessages>(() => {
    // Try to load from storage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        Object.keys(parsed).forEach(convId => {
          parsed[convId] = parsed[convId].map((msg: any) => ({
            ...msg,
            time: new Date(msg.time),
          }));
        });
        return parsed;
      } catch {
        return {};
      }
    }
    return {};
  });
  
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  // Save messages to storage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversationMessages));
  }, [conversationMessages]);

  const getMessages = useCallback((conversationId: string): Message[] => {
    if (!conversationMessages[conversationId]) {
      // Initialize with mock messages
      const initialMessages = generateInitialMessages(conversationId);
      setConversationMessages(prev => ({
        ...prev,
        [conversationId]: initialMessages,
      }));
      return initialMessages;
    }
    return conversationMessages[conversationId];
  }, [conversationMessages]);

  const sendMessage = useCallback((
    conversationId: string, 
    text: string, 
    mediaUrl?: string, 
    mediaType?: 'image' | 'video' | 'audio',
    replyTo?: Message
  ) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      isMine: true,
      time: new Date(),
      status: 'sending',
      mediaUrl,
      mediaType,
      replyTo: replyTo ? {
        id: replyTo.id,
        text: replyTo.text,
        isMine: replyTo.isMine,
        time: replyTo.time,
        status: replyTo.status,
      } : undefined,
    };

    setConversationMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));

    // Simulate sending
    setTimeout(() => {
      setConversationMessages(prev => ({
        ...prev,
        [conversationId]: prev[conversationId].map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        ),
      }));
    }, 500);

    // Simulate delivery
    setTimeout(() => {
      setConversationMessages(prev => ({
        ...prev,
        [conversationId]: prev[conversationId].map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        ),
      }));
    }, 1500);

    // Update last message in conversation
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? {
            ...conv,
            lastMessage: {
              id: newMessage.id,
              senderId: currentUser.id,
              content: text || '📷 Mídia',
              createdAt: new Date(),
              isRead: true,
            },
          }
        : conv
    ));

    // Simulate reply after a delay (random chance)
    if (Math.random() > 0.5) {
      setTimeout(() => {
        setTypingUsers(prev => ({ ...prev, [conversationId]: true }));
        
        setTimeout(() => {
          setTypingUsers(prev => ({ ...prev, [conversationId]: false }));
          
          const replies = [
            'Que legal! 😊',
            'Adorei! 💕',
            'Concordo totalmente!',
            'Isso é incrível!',
            'Haha, muito bom! 😂',
            'Vou pensar nisso...',
            '🔥🔥🔥',
            'Conta mais!',
          ];
          
          const replyMessage: Message = {
            id: `msg-${Date.now()}`,
            text: replies[Math.floor(Math.random() * replies.length)],
            isMine: false,
            time: new Date(),
            status: 'read',
          };

          setConversationMessages(prev => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] || []), replyMessage],
          }));

          // Update conversation with unread
          setConversations(prev => prev.map(conv => 
            conv.id === conversationId 
              ? {
                  ...conv,
                  lastMessage: {
                    id: replyMessage.id,
                    senderId: conv.participant.id,
                    content: replyMessage.text,
                    createdAt: new Date(),
                    isRead: false,
                  },
                  unreadCount: conv.unreadCount + 1,
                }
              : conv
          ));
        }, 2000 + Math.random() * 2000);
      }, 3000 + Math.random() * 3000);
    }

    return newMessage;
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unreadCount: 0 }
        : conv
    ));

    setConversationMessages(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map(msg => 
        !msg.isMine ? { ...msg, status: 'read' as const } : msg
      ),
    }));
  }, []);

  const isTyping = useCallback((conversationId: string) => {
    return typingUsers[conversationId] || false;
  }, [typingUsers]);

  const getTotalUnread = useCallback(() => {
    return conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  }, [conversations]);

  const searchConversations = useCallback((query: string) => {
    if (!query.trim()) return conversations;
    
    const lowerQuery = query.toLowerCase();
    return conversations.filter(conv => {
      const names = conv.participant.members.map(m => m.name.toLowerCase());
      return names.some(name => name.includes(lowerQuery));
    });
  }, [conversations]);

  const addReaction = useCallback((conversationId: string, messageId: string, emoji: ReactionType) => {
    setConversationMessages(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map(msg => {
        if (msg.id !== messageId) return msg;
        
        const existingReactions = msg.reactions || [];
        const myReactionIndex = existingReactions.findIndex(r => r.userId === currentUser.id);
        
        let newReactions: MessageReaction[];
        if (myReactionIndex >= 0) {
          // If same emoji, remove it; otherwise replace
          if (existingReactions[myReactionIndex].emoji === emoji) {
            newReactions = existingReactions.filter((_, i) => i !== myReactionIndex);
          } else {
            newReactions = existingReactions.map((r, i) => 
              i === myReactionIndex ? { ...r, emoji } : r
            );
          }
        } else {
          newReactions = [...existingReactions, { emoji, userId: currentUser.id }];
        }
        
        return { ...msg, reactions: newReactions };
      }),
    }));
  }, []);

  const deleteMessage = useCallback((conversationId: string, messageId: string) => {
    setConversationMessages(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map(msg => 
        msg.id === messageId && msg.isMine
          ? { ...msg, isDeleted: true, text: 'Mensagem apagada' }
          : msg
      ),
    }));
  }, []);

  const editMessage = useCallback((conversationId: string, messageId: string, newText: string) => {
    setConversationMessages(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map(msg => 
        msg.id === messageId && msg.isMine
          ? { ...msg, text: newText, isEdited: true }
          : msg
      ),
    }));
  }, []);

  return {
    conversations,
    getMessages,
    sendMessage,
    markAsRead,
    isTyping,
    getTotalUnread,
    searchConversations,
    addReaction,
    deleteMessage,
    editMessage,
  };
}
