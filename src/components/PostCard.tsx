import { useState, useEffect, useCallback } from 'react';
import { Post } from '@/types';
import { ProfileAvatar } from './ProfileAvatar';
import { VerifiedBadge } from './VerifiedBadge';
import { Heart, MessageCircle, Send, Bookmark, Lock, MoreHorizontal, Eye, EyeOff, Timer, Unlock, MapPin, Users } from 'lucide-react';
import { formatTimeAgo, currentUser, mockUsers } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { CommentsSheet, Comment, generateMockComments } from './CommentsSheet';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onUnlock?: (postId: string, price: number) => void;
}

const VIEW_DURATION = 30; // seconds

export function PostCard({ post, onLike, onUnlock }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.comments);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isPurchased, setIsPurchased] = useState(post.isUnlocked || false);
  const [isViewing, setIsViewing] = useState(false);
  const [viewTimer, setViewTimer] = useState(VIEW_DURATION);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Determine if blur should be shown
  const showBlur = post.isPaid && (!isPurchased || (isPurchased && !isViewing));

  // Initialize mock comments
  useEffect(() => {
    setComments(generateMockComments(Math.min(post.comments, 10)));
  }, [post.comments]);

  // Timer countdown when viewing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isViewing && isPurchased) {
      interval = setInterval(() => {
        setViewTimer(prev => {
          if (prev <= 1) {
            setIsViewing(false);
            return VIEW_DURATION;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isViewing, isPurchased]);

  const startViewing = useCallback(() => {
    setViewTimer(VIEW_DURATION);
    setIsViewing(true);
  }, []);

  const stopViewing = useCallback(() => {
    setIsViewing(false);
    setViewTimer(VIEW_DURATION);
  }, []);

  // Render content with clickable mentions
  const renderContentWithMentions = (text: string) => {
    const mentionRegex = /@(\w+)/g;
    const parts = text.split(mentionRegex);
    
    return parts.map((part, index) => {
      // Every odd index is a username (captured group)
      if (index % 2 === 1) {
        const user = mockUsers.find(u => u.username.toLowerCase() === part.toLowerCase());
        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              if (user) navigate(`/profile/${user.id}`);
            }}
            className="text-primary font-medium hover:underline"
          >
            @{part}
          </button>
        );
      }
      return part;
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsLikeAnimating(true);
    setTimeout(() => setIsLikeAnimating(false), 300);
    onLike?.(post.id);
  };

  const handleDoubleTapLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
      setIsLikeAnimating(true);
      setTimeout(() => setIsLikeAnimating(false), 300);
      onLike?.(post.id);
    }
  };

  const handleUnlock = () => {
    if (!isPurchased && post.price) {
      // Simulate payment process
      toast({
        title: 'Processando pagamento...',
        description: `Desbloqueando por R$ ${post.price.toFixed(2)}`,
      });
      
      setTimeout(() => {
        setIsPurchased(true);
        startViewing();
        onUnlock?.(post.id, post.price!);
        toast({
          title: 'Conteúdo desbloqueado!',
          description: `Você tem ${VIEW_DURATION} segundos para visualizar. Toque novamente quando quiser ver.`,
        });
      }, 1500);
    }
  };

  const handleToggleView = () => {
    if (isPurchased) {
      if (isViewing) {
        stopViewing();
      } else {
        startViewing();
      }
    }
  };

  const handleAddComment = (content: string, parentId?: string, mentions?: string[]) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: currentUser,
      content,
      likes: 0,
      isLiked: false,
      createdAt: new Date(),
      mentions,
      replies: [],
    };
    
    if (parentId) {
      setComments(prev => 
        prev.map(c => 
          c.id === parentId 
            ? { ...c, replies: [...(c.replies || []), newComment] }
            : c
        )
      );
    } else {
      setComments(prev => [newComment, ...prev]);
      setCommentsCount(prev => prev + 1);
    }
    
    toast({
      title: parentId ? 'Resposta enviada' : 'Comentário adicionado',
      description: parentId ? 'Sua resposta foi publicada!' : 'Seu comentário foi publicado com sucesso!',
    });
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => 
      prev.map(c => 
        c.id === commentId 
          ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  };

  const handleShare = () => {
    toast({
      title: 'Link copiado!',
      description: 'O link do post foi copiado para a área de transferência.',
    });
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? 'Removido dos salvos' : 'Salvo!',
      description: isSaved 
        ? 'O post foi removido da sua coleção.' 
        : 'O post foi adicionado à sua coleção.',
    });
  };

  return (
    <article className="border-b border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button 
          className="flex items-center gap-3"
          onClick={() => navigate(`/profile/${post.author.id}`)}
        >
          <ProfileAvatar 
            profileType={post.author.profileType}
            members={post.author.members}
            size="sm"
          />
          <div className="text-left">
            <span className="font-medium text-sm flex items-center gap-1">
              {post.author.username}
              {post.author.isVerified && <VerifiedBadge size="xs" showTooltip={false} />}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{formatTimeAgo(post.createdAt)}</span>
              {post.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="h-3 w-3" />
                    {post.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      {post.type === 'text' ? (
        <div className="px-4 pb-3">
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>
      ) : (
        <>
          <div 
            className="relative aspect-square bg-muted cursor-pointer select-none"
            onDoubleClick={!showBlur ? handleDoubleTapLike : undefined}
          >
            <img 
              src={post.mediaUrl} 
              alt=""
              className={cn(
                "w-full h-full object-cover transition-all duration-500",
                showBlur && "blur-xl scale-110"
              )}
              draggable={false}
            />
            
            {/* Double tap like animation */}
            {isLikeAnimating && !showBlur && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Heart className="h-24 w-24 text-white fill-white animate-ping opacity-80" />
              </div>
            )}
            
            {/* Not purchased - show unlock button */}
            {post.isPaid && !isPurchased && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                <Lock className="h-10 w-10 text-white mb-3" />
                <p className="text-white font-medium mb-3">Conteúdo exclusivo</p>
                <button 
                  onClick={handleUnlock}
                  className="bg-primary text-primary-foreground font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Desbloquear • R$ {post.price?.toFixed(2)}
                </button>
              </div>
            )}

            {/* Purchased but hidden - show view button */}
            {post.isPaid && isPurchased && !isViewing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                <EyeOff className="h-10 w-10 text-white/80 mb-3" />
                <p className="text-white font-medium mb-1">Conteúdo oculto</p>
                <p className="text-white/70 text-sm mb-4">Toque para visualizar</p>
                <Button 
                  onClick={handleToggleView}
                  variant="secondary"
                  className="rounded-full px-6"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar ({VIEW_DURATION}s)
                </Button>
                <Badge className="mt-3 bg-green-500/90 text-white">
                  <Unlock className="h-3 w-3 mr-1" />
                  Já comprado
                </Badge>
              </div>
            )}

            {/* Viewing - show timer and hide button */}
            {post.isPaid && isPurchased && isViewing && (
              <>
                {/* Timer badge */}
                <div className="absolute top-3 left-3 z-10">
                  <Badge className="bg-black/70 text-white gap-1.5 px-3 py-1">
                    <Timer className="h-3.5 w-3.5" />
                    <span className="font-mono">{viewTimer}s</span>
                  </Badge>
                </div>
                
                {/* Hide button */}
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-3 right-3 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full"
                  onClick={stopViewing}
                >
                  <EyeOff className="h-4 w-4 mr-1" />
                  Ocultar
                </Button>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                  <div 
                    className="h-full bg-primary transition-all duration-1000 ease-linear"
                    style={{ width: `${(viewTimer / VIEW_DURATION) * 100}%` }}
                  />
                </div>
              </>
            )}
          {/* Tagged users indicator */}
          {post.taggedUsers && post.taggedUsers.length > 0 && !showBlur && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 rounded-full text-xs text-white font-medium">
              <Users className="h-3.5 w-3.5" />
              {post.taggedUsers.length === 1 
                ? mockUsers.find(u => u.id === post.taggedUsers![0])?.username || '1 pessoa'
                : `${post.taggedUsers.length} pessoas`
              }
            </div>
          )}
          </div>

          {post.content && (
            <div className="px-4 pt-3">
              <p className="text-[15px]">
                <span className="font-medium">{post.author.username}</span>{' '}
                {renderContentWithMentions(post.content)}
              </p>
            </div>
          )}
        </>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center">
          <button 
            onClick={handleLike} 
            className="p-2 active:scale-90 transition-transform"
          >
            <Heart 
              className={cn(
                "h-6 w-6 transition-all",
                isLiked && "fill-red-500 text-red-500 scale-110"
              )} 
              strokeWidth={1.5}
            />
          </button>
          <button 
            onClick={() => setShowComments(true)}
            className="p-2 active:scale-90 transition-transform"
          >
            <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
          </button>
          <button 
            onClick={handleShare}
            className="p-2 active:scale-90 transition-transform"
          >
            <Send className="h-6 w-6" strokeWidth={1.5} />
          </button>
          
          {/* View toggle for purchased paid content */}
          {post.isPaid && isPurchased && (
            <button 
              onClick={handleToggleView}
              className={cn(
                "p-2 active:scale-90 transition-transform ml-1",
                isViewing && "text-primary"
              )}
            >
              {isViewing ? (
                <EyeOff className="h-6 w-6" strokeWidth={1.5} />
              ) : (
                <Eye className="h-6 w-6" strokeWidth={1.5} />
              )}
            </button>
          )}
        </div>
        <button 
          onClick={handleSave} 
          className="p-2 active:scale-90 transition-transform"
        >
          <Bookmark 
            className={cn(
              "h-6 w-6 transition-all",
              isSaved && "fill-foreground"
            )} 
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* Likes & Comments Summary */}
      <div className="px-4 pb-3 space-y-1">
        <p className="text-sm font-semibold">{likesCount.toLocaleString()} curtidas</p>
        {commentsCount > 0 && (
          <button 
            onClick={() => setShowComments(true)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver todos os {commentsCount} comentários
          </button>
        )}
      </div>

      {/* Comments Sheet */}
      <CommentsSheet
        open={showComments}
        onOpenChange={setShowComments}
        post={post}
        comments={comments}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
      />
    </article>
  );
}