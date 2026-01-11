import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Eye, Heart, Send, Pause, Play } from 'lucide-react';
import { ProfileAvatar } from './ProfileAvatar';
import { UserStories } from './StoriesBar';
import { formatTimeAgo } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

interface StoriesViewerProps {
  userStories: UserStories;
  initialIndex?: number;
  onClose: () => void;
  onNextUser: () => void;
  onPrevUser: () => void;
  isCurrentUser?: boolean;
}

const STORY_DURATION = 5000; // 5 seconds per story

export function StoriesViewer({
  userStories,
  initialIndex = 0,
  onClose,
  onNextUser,
  onPrevUser,
  isCurrentUser,
}: StoriesViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reply, setReply] = useState('');

  const currentStory = userStories.stories[currentIndex];

  const goToNext = useCallback(() => {
    if (currentIndex < userStories.stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onNextUser();
    }
  }, [currentIndex, userStories.stories.length, onNextUser]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    } else {
      onPrevUser();
    }
  }, [currentIndex, onPrevUser]);

  // Progress timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, goToNext]);

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const screenWidth = window.innerWidth;
    
    if (touch.clientX < screenWidth / 3) {
      goToPrev();
    } else if (touch.clientX > (screenWidth * 2) / 3) {
      goToNext();
    } else {
      setIsPaused(true);
    }
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  const handleSendReply = () => {
    if (reply.trim()) {
      // Would send reply to story author
      setReply('');
    }
  };

  if (!currentStory) return null;

  const timeRemaining = () => {
    const now = new Date();
    const expires = new Date(currentStory.expiresAt);
    const diffHours = Math.floor((expires.getTime() - now.getTime()) / (1000 * 60 * 60));
    if (diffHours <= 0) return 'Expirando';
    return `${diffHours}h restantes`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-2 pt-2">
        {userStories.stories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width: index < currentIndex 
                  ? '100%' 
                  : index === currentIndex 
                    ? `${progress}%` 
                    : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-4 pt-2">
        <div className="flex items-center gap-3">
          <ProfileAvatar
            profileType={userStories.user.profileType}
            members={userStories.user.members}
            size="sm"
          />
          <div>
            <p className="text-white text-sm font-medium">{userStories.user.username}</p>
            <p className="text-white/60 text-xs">{formatTimeAgo(currentStory.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 text-white/80 hover:text-white"
          >
            {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Story Content */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {currentStory.mediaType === 'video' ? (
          <video
            src={currentStory.mediaUrl}
            className="w-full h-full object-contain"
            autoPlay
            muted
            playsInline
          />
        ) : (
          <img
            src={currentStory.mediaUrl}
            alt=""
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Navigation areas (invisible) */}
      <button
        onClick={goToPrev}
        className="absolute left-0 top-20 bottom-20 w-1/3 z-10"
        aria-label="Story anterior"
      />
      <button
        onClick={goToNext}
        className="absolute right-0 top-20 bottom-20 w-1/3 z-10"
        aria-label="Próximo story"
      />

      {/* Navigation arrows (desktop) */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/20 rounded-full text-white/80 hover:text-white hover:bg-black/40 hidden md:block"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/20 rounded-full text-white/80 hover:text-white hover:bg-black/40 hidden md:block"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
        {isCurrentUser ? (
          // View count for own stories
          <div className="flex items-center justify-center gap-2 text-white/80">
            <Eye className="h-5 w-5" />
            <span className="text-sm">{currentStory.views} visualizações</span>
            <span className="text-white/40 text-sm ml-2">• {timeRemaining()}</span>
          </div>
        ) : (
          // Reply input for others' stories
          <div className="flex items-center gap-3">
            <Input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Enviar mensagem..."
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
            />
            <button className="p-2 text-white/80 hover:text-white">
              <Heart className="h-6 w-6" />
            </button>
            <button 
              onClick={handleSendReply}
              className="p-2 text-white/80 hover:text-white"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
