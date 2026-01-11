import { Home, Search, Plus, MessageCircle, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  path: string;
  isCreate?: boolean;
}

const navItems: NavItem[] = [
  { icon: Home, path: '/' },
  { icon: Search, path: '/explore' },
  { icon: Plus, path: '/create', isCreate: true },
  { icon: MessageCircle, path: '/chat' },
  { icon: User, path: '/profile' },
];

interface BottomNavProps {
  onCreateClick?: () => void;
}

export function BottomNav({ onCreateClick }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (item: NavItem) => {
    if (item.isCreate && onCreateClick) {
      onCreateClick();
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="max-w-lg mx-auto flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item)}
              className={cn(
                "flex items-center justify-center h-14 w-14 transition-colors",
                item.isCreate && "text-primary",
                isActive && !item.isCreate && "text-foreground",
                !isActive && !item.isCreate && "text-muted-foreground"
              )}
            >
              <Icon 
                className="h-6 w-6" 
                strokeWidth={isActive || item.isCreate ? 2.5 : 1.5}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
