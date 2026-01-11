import { UserProfile } from '@/types';
import { mockUsers, currentUser } from './mockData';

export type NotificationType = 
  | 'like' 
  | 'comment' 
  | 'follow' 
  | 'mention' 
  | 'story_view' 
  | 'story_reply'
  | 'subscription'
  | 'purchase'
  | 'boost';

export interface Notification {
  id: string;
  type: NotificationType;
  actor: UserProfile;
  message: string;
  targetId?: string;
  targetPreview?: string;
  isRead: boolean;
  createdAt: Date;
}

// Generate mock notifications
export const generateMockNotifications = (): Notification[] => {
  const notifications: Notification[] = [
    {
      id: 'n1',
      type: 'like',
      actor: mockUsers[1],
      message: 'curtiu sua foto',
      targetPreview: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=100&h=100&fit=crop',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
    },
    {
      id: 'n2',
      type: 'comment',
      actor: mockUsers[3],
      message: 'comentou: "Vocês são lindos! 💕"',
      targetPreview: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=100&h=100&fit=crop',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
    },
    {
      id: 'n3',
      type: 'follow',
      actor: mockUsers[4],
      message: 'começou a seguir você',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    },
    {
      id: 'n4',
      type: 'mention',
      actor: mockUsers[2],
      message: 'mencionou você em um comentário',
      targetPreview: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
    {
      id: 'n5',
      type: 'story_view',
      actor: mockUsers[1],
      message: 'visualizou seu story',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: 'n6',
      type: 'story_reply',
      actor: mockUsers[3],
      message: 'respondeu ao seu story: "Arrasou! 🔥"',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    },
    {
      id: 'n7',
      type: 'subscription',
      actor: mockUsers[4],
      message: 'assinou seu plano Premium',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    },
    {
      id: 'n8',
      type: 'purchase',
      actor: mockUsers[2],
      message: 'comprou "Pack Exclusivo - 10 Fotos HD"',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    },
    {
      id: 'n9',
      type: 'like',
      actor: mockUsers[1],
      message: 'e outras 23 pessoas curtiram sua foto',
      targetPreview: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    },
    {
      id: 'n10',
      type: 'boost',
      actor: currentUser,
      message: 'Seu perfil em destaque alcançou 1.2K visualizações!',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
      id: 'n11',
      type: 'follow',
      actor: mockUsers[3],
      message: 'começou a seguir você',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    },
    {
      id: 'n12',
      type: 'comment',
      actor: mockUsers[4],
      message: 'comentou: "Meta de relacionamento! 🙌"',
      targetPreview: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=100&h=100&fit=crop',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    },
  ];

  return notifications;
};

export const getNotificationIcon = (type: NotificationType): string => {
  const icons: Record<NotificationType, string> = {
    like: '❤️',
    comment: '💬',
    follow: '👤',
    mention: '@',
    story_view: '👁️',
    story_reply: '💌',
    subscription: '⭐',
    purchase: '🛍️',
    boost: '🚀',
  };
  return icons[type];
};
