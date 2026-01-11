import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ProfileAvatar } from './ProfileAvatar';
import { UserProfile } from '@/types';
import { cn } from '@/lib/utils';
import { StoriesViewer } from './StoriesViewer';
import { CreateStorySheet } from './CreateStorySheet';

export interface Story {
  id: string;
  author: UserProfile;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: Date;
  expiresAt: Date;
  views: number;
  isViewed: boolean;
}

export interface UserStories {
  user: UserProfile;
  stories: Story[];
  hasUnviewed: boolean;
}

interface StoriesBarProps {
  currentUser: UserProfile;
  userStories: UserStories[];
  onAddStory?: (mediaUrl: string, mediaType: 'image' | 'video') => void;
}

export function StoriesBar({ currentUser, userStories, onAddStory }: StoriesBarProps) {
  const [viewingStories, setViewingStories] = useState<UserStories | null>(null);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [showCreateStory, setShowCreateStory] = useState(false);

  const currentUserStories = userStories.find(us => us.user.id === currentUser.id);
  const hasOwnStory = currentUserStories && currentUserStories.stories.length > 0;

  const handleStoryClick = (userStory: UserStories, startIndex: number = 0) => {
    setViewerIndex(startIndex);
    setViewingStories(userStory);
  };

  const handleViewerClose = () => {
    setViewingStories(null);
    setViewerIndex(0);
  };

  const handleNextUser = () => {
    if (!viewingStories) return;
    const currentIndex = userStories.findIndex(us => us.user.id === viewingStories.user.id);
    if (currentIndex < userStories.length - 1) {
      setViewingStories(userStories[currentIndex + 1]);
      setViewerIndex(0);
    } else {
      handleViewerClose();
    }
  };

  const handlePrevUser = () => {
    if (!viewingStories) return;
    const currentIndex = userStories.findIndex(us => us.user.id === viewingStories.user.id);
    if (currentIndex > 0) {
      setViewingStories(userStories[currentIndex - 1]);
      setViewerIndex(0);
    }
  };

  return (
    <>
      <div className="bg-background border-b border-border">
        <div className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-hide">
          {/* Add Story Button / Current User Story */}
          <button
            onClick={() => hasOwnStory ? handleStoryClick(currentUserStories!) : setShowCreateStory(true)}
            className="flex flex-col items-center gap-1 shrink-0"
          >
            <div className="relative">
              <div className={cn(
                "rounded-full p-[2px]",
                hasOwnStory && currentUserStories?.hasUnviewed 
                  ? "bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400"
                  : hasOwnStory 
                    ? "bg-muted-foreground/30"
                    : ""
              )}>
                <div className="bg-background rounded-full p-[2px]">
                  <ProfileAvatar
                    profileType={currentUser.profileType}
                    members={currentUser.members}
                    size="lg"
                  />
                </div>
              </div>
              {!hasOwnStory && (
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 border-2 border-background">
                  <Plus className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground w-16 text-center truncate">
              {hasOwnStory ? 'Seu story' : 'Adicionar'}
            </span>
          </button>

          {/* Other Users Stories */}
          {userStories
            .filter(us => us.user.id !== currentUser.id)
            .map((userStory) => (
              <button
                key={userStory.user.id}
                onClick={() => handleStoryClick(userStory)}
                className="flex flex-col items-center gap-1 shrink-0"
              >
                <div className={cn(
                  "rounded-full p-[2px]",
                  userStory.hasUnviewed 
                    ? "bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400"
                    : "bg-muted-foreground/30"
                )}>
                  <div className="bg-background rounded-full p-[2px]">
                    <ProfileAvatar
                      profileType={userStory.user.profileType}
                      members={userStory.user.members}
                      size="lg"
                    />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground w-16 text-center truncate">
                  {userStory.user.username}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* Stories Viewer */}
      {viewingStories && (
        <StoriesViewer
          userStories={viewingStories}
          initialIndex={viewerIndex}
          onClose={handleViewerClose}
          onNextUser={handleNextUser}
          onPrevUser={handlePrevUser}
          isCurrentUser={viewingStories.user.id === currentUser.id}
        />
      )}

      {/* Create Story Sheet */}
      <CreateStorySheet
        open={showCreateStory}
        onOpenChange={setShowCreateStory}
        onCreateStory={onAddStory}
      />
    </>
  );
}
