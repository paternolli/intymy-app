import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfileAvatar } from './ProfileAvatar';
import { UserProfile } from '@/types';
import { X, Search, Check, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagPeopleSheetProps {
  open: boolean;
  onClose: () => void;
  users: UserProfile[];
  taggedUsers: UserProfile[];
  onTagChange: (users: UserProfile[]) => void;
}

export function TagPeopleSheet({ 
  open, 
  onClose, 
  users, 
  taggedUsers, 
  onTagChange 
}: TagPeopleSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.members[0]?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isTagged = (userId: string) => 
    taggedUsers.some(u => u.id === userId);

  const toggleTag = (user: UserProfile) => {
    if (isTagged(user.id)) {
      onTagChange(taggedUsers.filter(u => u.id !== user.id));
    } else {
      onTagChange([...taggedUsers, user]);
    }
  };

  const handleDone = () => {
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-6 w-6" />
        </button>
        <h2 className="font-semibold text-lg">Marcar pessoas</h2>
        <Button size="sm" onClick={handleDone} className="rounded-full">
          Pronto
        </Button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pessoas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
      </div>

      {/* Tagged users */}
      {taggedUsers.length > 0 && (
        <div className="px-4 pb-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Marcadas ({taggedUsers.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {taggedUsers.map(user => (
              <button
                key={user.id}
                onClick={() => toggleTag(user)}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
              >
                <span>@{user.username}</span>
                <X className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* User list */}
      <div className="flex-1 overflow-y-auto">
        <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Sugestões
        </p>
        <div className="px-4 space-y-1">
          {filteredUsers.map(user => (
            <button
              key={user.id}
              onClick={() => toggleTag(user)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left",
                isTagged(user.id) ? "bg-primary/10" : "hover:bg-muted"
              )}
            >
              <ProfileAvatar
                profileType={user.profileType}
                members={user.members}
                size="sm"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">@{user.username}</p>
                <p className="text-xs text-muted-foreground">{user.members[0]?.name}</p>
              </div>
              {isTagged(user.id) ? (
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                  <UserPlus className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
            </button>
          ))}
          
          {filteredUsers.length === 0 && (
            <p className="text-center py-8 text-muted-foreground text-sm">
              Nenhuma pessoa encontrada
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
