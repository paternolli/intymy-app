import { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProfileAvatar } from './ProfileAvatar';
import { Heart, Send, ChevronDown, ChevronUp, X, AtSign } from 'lucide-react';
import { Post, UserProfile } from '@/types';
import { formatTimeAgo, currentUser, mockUsers } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export interface Comment {
  id: string;
  author: UserProfile;
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: Date;
  replies?: Comment[];
  mentions?: string[];
}

interface CommentsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post;
  comments: Comment[];
  onAddComment: (content: string, parentId?: string, mentions?: string[]) => void;
  onLikeComment: (commentId: string) => void;
}

// Generate mock replies
const generateMockReplies = (parentAuthor: string): Comment[] => {
  const replyTexts = [
    `@${parentAuthor} concordo! 🙌`,
    `@${parentAuthor} isso mesmo!`,
    `@${parentAuthor} vocês arrasam! 💕`,
    `@${parentAuthor} perfeito!`,
  ];

  const numReplies = Math.floor(Math.random() * 3);
  return Array.from({ length: numReplies }, (_, i) => ({
    id: `reply-${Date.now()}-${i}-${Math.random()}`,
    author: mockUsers[Math.floor(Math.random() * mockUsers.length)],
    content: replyTexts[Math.floor(Math.random() * replyTexts.length)],
    likes: Math.floor(Math.random() * 20),
    isLiked: Math.random() > 0.8,
    createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 12),
    mentions: [parentAuthor],
  }));
};

// Generate mock comments for posts
export const generateMockComments = (count: number): Comment[] => {
  const commentTexts = [
    'Incrível! 😍',
    'Amei demais!',
    'Vocês são lindos! 💕',
    'Que foto maravilhosa!',
    'Perfeição! 🔥',
    'Quando vão postar mais?',
    'Casal mais lindo! 😍',
    'Meta de relacionamento!',
    'Que inveja branca! 💜',
    'Arrasou! 👏',
    'Simplesmente perfeito!',
    'Meus favoritos! ❤️',
  ];

  return Array.from({ length: count }, (_, i) => {
    const author = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    return {
      id: `comment-${Date.now()}-${i}`,
      author,
      content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
      likes: Math.floor(Math.random() * 50),
      isLiked: Math.random() > 0.7,
      createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 3),
      replies: Math.random() > 0.5 ? generateMockReplies(author.username) : [],
    };
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

// Extract mentions from text
const extractMentions = (text: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  return mentions;
};

// Render text with highlighted mentions
const renderContentWithMentions = (content: string) => {
  const parts = content.split(/(@\w+)/g);
  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      return (
        <span key={index} className="text-primary font-medium cursor-pointer hover:underline">
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  likedComments: Set<string>;
  onLike: (id: string) => void;
  onReply: (comment: Comment) => void;
  expandedReplies: Set<string>;
  onToggleReplies: (id: string) => void;
}

function CommentItem({ 
  comment, 
  isReply, 
  likedComments, 
  onLike, 
  onReply,
  expandedReplies,
  onToggleReplies
}: CommentItemProps) {
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isExpanded = expandedReplies.has(comment.id);

  return (
    <div className={cn("flex gap-3", isReply && "ml-10")}>
      <ProfileAvatar
        profileType={comment.author.profileType}
        members={comment.author.members}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <span className="font-semibold">{comment.author.username}</span>{' '}
              <span className="text-foreground/90">{renderContentWithMentions(comment.content)}</span>
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span>{formatTimeAgo(comment.createdAt)}</span>
              <button className="font-medium hover:text-foreground">
                {comment.likes + (likedComments.has(comment.id) && !comment.isLiked ? 1 : 0) - (!likedComments.has(comment.id) && comment.isLiked ? 1 : 0)} curtidas
              </button>
              <button 
                onClick={() => onReply(comment)}
                className="font-medium hover:text-foreground"
              >
                Responder
              </button>
            </div>
            
            {/* Toggle replies button */}
            {hasReplies && !isReply && (
              <button
                onClick={() => onToggleReplies(comment.id)}
                className="flex items-center gap-1 mt-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <div className="w-6 h-px bg-muted-foreground/50" />
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3" />
                    Ocultar respostas
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" />
                    Ver {comment.replies!.length} resposta{comment.replies!.length > 1 ? 's' : ''}
                  </>
                )}
              </button>
            )}
          </div>
          <button 
            onClick={() => onLike(comment.id)}
            className="p-1 mt-1"
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-all",
                likedComments.has(comment.id) 
                  ? "fill-red-500 text-red-500 scale-110" 
                  : "text-muted-foreground"
              )} 
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export function CommentsSheet({ 
  open, 
  onOpenChange, 
  post, 
  comments,
  onAddComment,
  onLikeComment 
}: CommentsSheetProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [likedComments, setLikedComments] = useState<Set<string>>(() => {
    const liked = new Set<string>();
    comments.forEach(c => {
      if (c.isLiked) liked.add(c.id);
      c.replies?.forEach(r => {
        if (r.isLiked) liked.add(r.id);
      });
    });
    return liked;
  });

  // Focus input when replying
  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

  // Check for @ mentions while typing
  useEffect(() => {
    const lastAtIndex = newComment.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = newComment.slice(lastAtIndex + 1);
      const hasSpace = textAfterAt.includes(' ');
      if (!hasSpace && textAfterAt.length > 0) {
        setMentionQuery(textAfterAt.toLowerCase());
        setShowMentionSuggestions(true);
      } else {
        setShowMentionSuggestions(false);
      }
    } else {
      setShowMentionSuggestions(false);
    }
  }, [newComment]);

  const filteredUsers = mockUsers.filter(user => 
    user.username.toLowerCase().includes(mentionQuery)
  ).slice(0, 5);

  const handleSelectMention = (username: string) => {
    const lastAtIndex = newComment.lastIndexOf('@');
    const newText = newComment.slice(0, lastAtIndex) + '@' + username + ' ';
    setNewComment(newText);
    setShowMentionSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const mentions = extractMentions(newComment);
      onAddComment(newComment.trim(), replyingTo?.id, mentions);
      
      // Show mention notifications
      if (mentions.length > 0) {
        const validMentions = mentions.filter(m => 
          mockUsers.some(u => u.username.toLowerCase() === m.toLowerCase())
        );
        if (validMentions.length > 0) {
          toast({
            title: 'Menção enviada',
            description: `${validMentions.map(m => '@' + m).join(', ')} ${validMentions.length > 1 ? 'foram notificados' : 'foi notificado'}.`,
          });
        }
      }
      
      setNewComment('');
      setReplyingTo(null);
    }
  };

  const handleLikeComment = (commentId: string) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
    onLikeComment(commentId);
  };

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
    setNewComment(`@${comment.author.username} `);
  };

  const handleToggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setNewComment('');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="text-center">Comentários</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100%-8rem)]">
          {/* Comments List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p className="text-lg font-medium">Nenhum comentário ainda</p>
                <p className="text-sm">Seja o primeiro a comentar!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  <CommentItem
                    comment={comment}
                    likedComments={likedComments}
                    onLike={handleLikeComment}
                    onReply={handleReply}
                    expandedReplies={expandedReplies}
                    onToggleReplies={handleToggleReplies}
                  />
                  
                  {/* Replies */}
                  {expandedReplies.has(comment.id) && comment.replies?.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      isReply
                      likedComments={likedComments}
                      onLike={handleLikeComment}
                      onReply={handleReply}
                      expandedReplies={expandedReplies}
                      onToggleReplies={handleToggleReplies}
                    />
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Mention Suggestions */}
          {showMentionSuggestions && filteredUsers.length > 0 && (
            <div className="border-t border-border bg-background py-2 px-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2 px-2">
                <AtSign className="h-3 w-3" />
                Mencionar usuário
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 px-1">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectMention(user.username)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full hover:bg-muted/80 transition-colors shrink-0"
                  >
                    <ProfileAvatar
                      profileType={user.profileType}
                      members={user.members}
                      size="xs"
                    />
                    <span className="text-sm font-medium">{user.username}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reply indicator */}
          {replyingTo && (
            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Respondendo a <span className="font-medium text-foreground">@{replyingTo.author.username}</span>
              </p>
              <button 
                onClick={cancelReply}
                className="p-1 hover:bg-muted rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Input Area */}
          <form 
            onSubmit={handleSubmit}
            className="border-t border-border pt-4 flex items-center gap-3"
          >
            <ProfileAvatar
              profileType={currentUser.profileType}
              members={currentUser.members}
              size="sm"
            />
            <Input
              ref={inputRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyingTo ? `Responder a @${replyingTo.author.username}...` : "Adicione um comentário..."}
              className="flex-1 bg-muted/50 border-0 focus-visible:ring-1"
            />
            <Button 
              type="submit" 
              size="icon" 
              variant="ghost"
              disabled={!newComment.trim()}
              className="text-primary disabled:text-muted-foreground"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}