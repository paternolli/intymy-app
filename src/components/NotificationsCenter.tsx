import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProfileAvatar } from './ProfileAvatar';
import { Button } from './ui/button';
import { Bell, Heart, MessageCircle, UserPlus, AtSign, Eye, Star, ShoppingBag, Rocket, Check, Settings } from 'lucide-react';
import { Notification, NotificationType, generateMockNotifications } from '@/data/notifications';
import { formatTimeAgo } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface NotificationsCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnreadCountChange?: (count: number) => void;
}

const typeIcons: Record<NotificationType, React.ReactNode> = {
  like: <Heart className="h-4 w-4 text-red-500" />,
  comment: <MessageCircle className="h-4 w-4 text-blue-500" />,
  follow: <UserPlus className="h-4 w-4 text-green-500" />,
  mention: <AtSign className="h-4 w-4 text-purple-500" />,
  story_view: <Eye className="h-4 w-4 text-orange-500" />,
  story_reply: <MessageCircle className="h-4 w-4 text-pink-500" />,
  subscription: <Star className="h-4 w-4 text-yellow-500" />,
  purchase: <ShoppingBag className="h-4 w-4 text-emerald-500" />,
  boost: <Rocket className="h-4 w-4 text-primary" />,
};

export function NotificationsCenter({ open, onOpenChange, onUnreadCountChange }: NotificationsCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    setNotifications(generateMockNotifications());
  }, []);

  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    onUnreadCountChange?.(unreadCount);
  }, [notifications, onUnreadCountChange]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'interactions') return ['like', 'comment', 'mention'].includes(n.type);
    if (activeTab === 'follows') return n.type === 'follow';
    if (activeTab === 'stories') return ['story_view', 'story_reply'].includes(n.type);
    if (activeTab === 'business') return ['subscription', 'purchase', 'boost'].includes(n.type);
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const groupNotificationsByDate = (notifications: Notification[]) => {
    const today: Notification[] = [];
    const yesterday: Notification[] = [];
    const thisWeek: Notification[] = [];
    const older: Notification[] = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

    notifications.forEach(n => {
      if (n.createdAt >= todayStart) {
        today.push(n);
      } else if (n.createdAt >= yesterdayStart) {
        yesterday.push(n);
      } else if (n.createdAt >= weekStart) {
        thisWeek.push(n);
      } else {
        older.push(n);
      }
    });

    return { today, yesterday, thisWeek, older };
  };

  const grouped = groupNotificationsByDate(filteredNotifications);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.type === 'follow') {
      navigate(`/profile/${notification.actor.id}`);
      onOpenChange(false);
    }
  };

  const renderNotificationItem = (notification: Notification) => (
    <button
      key={notification.id}
      onClick={() => handleNotificationClick(notification)}
      className={cn(
        "w-full flex items-start gap-3 p-3 rounded-xl transition-colors text-left",
        notification.isRead ? "hover:bg-muted/50" : "bg-primary/5 hover:bg-primary/10"
      )}
    >
      <div className="relative">
        <ProfileAvatar
          profileType={notification.actor.profileType}
          members={notification.actor.members}
          size="sm"
        />
        <div className="absolute -bottom-1 -right-1 p-1 bg-background rounded-full border border-border">
          {typeIcons[notification.type]}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold">{notification.actor.username}</span>{' '}
          <span className="text-muted-foreground">{notification.message}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatTimeAgo(notification.createdAt)}
        </p>
      </div>

      {notification.targetPreview && (
        <img
          src={notification.targetPreview}
          alt=""
          className="w-11 h-11 rounded-lg object-cover shrink-0"
        />
      )}

      {!notification.isRead && (
        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
      )}
    </button>
  );

  const renderGroup = (title: string, items: Notification[]) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground px-3 py-2">{title}</h3>
        {items.map(renderNotificationItem)}
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="px-4 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
              {unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </SheetTitle>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Marcar todas
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-[calc(100%-5rem)]">
          <div className="border-b border-border px-2">
            <TabsList className="w-full h-auto bg-transparent p-0 gap-0">
              <TabsTrigger 
                value="all" 
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 text-sm"
              >
                Todas
              </TabsTrigger>
              <TabsTrigger 
                value="interactions"
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 text-sm"
              >
                Interações
              </TabsTrigger>
              <TabsTrigger 
                value="follows"
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 text-sm"
              >
                Seguidores
              </TabsTrigger>
              <TabsTrigger 
                value="business"
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 text-sm"
              >
                Vendas
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="flex-1 overflow-y-auto mt-0 p-2">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-lg font-medium">Nenhuma notificação</p>
                <p className="text-sm">Você está em dia!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {renderGroup('Hoje', grouped.today)}
                {renderGroup('Ontem', grouped.yesterday)}
                {renderGroup('Esta semana', grouped.thisWeek)}
                {renderGroup('Anteriores', grouped.older)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
