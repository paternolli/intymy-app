import { useState, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { NotificationsCenter } from './NotificationsCenter';
import { AnimatedLogo } from './AnimatedLogo';
import { cn } from '@/lib/utils';

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(4); // Initial mock count

  const handleUnreadCountChange = useCallback((count: number) => {
    setUnreadCount(count);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
          <AnimatedLogo variant="header" />
          
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-2 hover:bg-muted rounded-full transition-colors"
          >
            <Bell className={cn(
              "h-6 w-6 transition-colors",
              unreadCount > 0 && "text-foreground"
            )} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <NotificationsCenter
        open={showNotifications}
        onOpenChange={setShowNotifications}
        onUnreadCountChange={handleUnreadCountChange}
      />
    </>
  );
}
