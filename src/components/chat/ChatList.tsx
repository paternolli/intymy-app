import { useState } from 'react';
import { Search, Edit, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProfileAvatar, ProfileNames } from '@/components/ProfileAvatar';
import { formatTimeAgo, currentUser } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Conversation } from '@/types';

interface ChatListProps {
  conversations: Conversation[];
  onSelectChat: (conversation: Conversation) => void;
  onSearch: (query: string) => Conversation[];
}

export function ChatList({ conversations, onSelectChat, onSearch }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredConversations = searchQuery ? onSearch(searchQuery) : conversations;

  return (
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="px-4 py-3 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Mensagens</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <Edit className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <MoreHorizontal className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full bg-muted border-none"
          />
        </div>
      </div>

      {/* Online Now Section */}
      <div className="px-4 py-2">
        <p className="text-xs font-medium text-muted-foreground mb-3">ONLINE AGORA</p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {conversations.slice(0, 5).map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelectChat(conv)}
              className="flex flex-col items-center gap-1 min-w-[60px]"
            >
              <div className="relative">
                <ProfileAvatar
                  profileType={conv.participant.profileType}
                  members={conv.participant.members}
                  size="md"
                />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
              </div>
              <span className="text-xs truncate w-full text-center">
                {conv.participant.members[0].name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <p className="px-4 py-2 text-xs font-medium text-muted-foreground">MENSAGENS</p>
        
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Nenhuma conversa encontrada</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <button
              key={conv.id}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
              onClick={() => onSelectChat(conv)}
            >
              <div className="relative">
                <ProfileAvatar
                  profileType={conv.participant.profileType}
                  members={conv.participant.members}
                  size="md"
                />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={cn(
                    "font-medium text-sm truncate",
                    conv.unreadCount > 0 && "font-semibold"
                  )}>
                    <ProfileNames members={conv.participant.members} />
                  </p>
                  <span className={cn(
                    "text-xs",
                    conv.unreadCount > 0 ? "text-primary font-medium" : "text-muted-foreground"
                  )}>
                    {formatTimeAgo(conv.lastMessage.createdAt)}
                  </span>
                </div>
                <p className={cn(
                  "text-sm truncate",
                  conv.unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground"
                )}>
                  {conv.lastMessage.senderId === currentUser.id ? 'Você: ' : ''}
                  {conv.lastMessage.content}
                </p>
              </div>

              {conv.unreadCount > 0 && (
                <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                  {conv.unreadCount}
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
