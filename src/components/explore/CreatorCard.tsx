import { useNavigate } from 'react-router-dom';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { Button } from '@/components/ui/button';
import { MapPin, Users } from 'lucide-react';
import { CreatorWithLocation } from '@/data/locations';
import { getProfileTypeLabel } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useUserRelationships } from '@/hooks/useUserRelationships';

interface CreatorCardProps {
  creator: CreatorWithLocation;
  variant?: 'compact' | 'full';
}

export function CreatorCard({ creator, variant = 'full' }: CreatorCardProps) {
  const navigate = useNavigate();
  const { isFollowing, toggleFollow } = useUserRelationships();
  const isUserFollowing = isFollowing(creator.id);

  const formatDistance = (distance?: number) => {
    if (!distance) return null;
    if (distance < 1) return `${Math.round(distance * 1000)}m`;
    if (distance < 100) return `${distance.toFixed(1)}km`;
    return `${Math.round(distance)}km`;
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={() => navigate(`/profile/${creator.id}`)}
        className="flex flex-col items-center p-3 rounded-2xl bg-card hover:bg-muted/50 transition-colors w-full"
      >
        <div className="relative mb-2">
          <ProfileAvatar
            profileType={creator.profileType}
            members={creator.members}
            size="lg"
            showRing={creator.isOnline}
          />
          {creator.isOnline && (
            <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-card" />
          )}
        </div>
        <p className="font-medium text-sm truncate w-full text-center flex items-center justify-center gap-1">
          {creator.username}
          {creator.isVerified && <VerifiedBadge size="sm" />}
        </p>
        <p className="text-xs text-muted-foreground">{creator.location.city}</p>
        {creator.distance && (
          <p className="text-xs text-primary mt-0.5">{formatDistance(creator.distance)}</p>
        )}
      </button>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-card border border-border">
      <div className="flex gap-3">
        <button 
          onClick={() => navigate(`/profile/${creator.id}`)}
          className="relative shrink-0"
        >
          <ProfileAvatar
            profileType={creator.profileType}
            members={creator.members}
            size="lg"
            showRing={creator.isOnline}
          />
          {creator.isOnline && (
            <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-card" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <button 
            onClick={() => navigate(`/profile/${creator.id}`)}
            className="text-left w-full"
          >
            <div className="flex items-center gap-1.5">
              <p className="font-semibold truncate">{creator.username}</p>
              {creator.isVerified && <VerifiedBadge size="sm" />}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">{creator.bio}</p>
          </button>

          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {formatFollowers(creator.followers)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {creator.location.city}
            </span>
            {creator.distance && (
              <span className="text-primary font-medium">
                {formatDistance(creator.distance)}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {getProfileTypeLabel(creator.profileType)}
            </span>
            {creator.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-muted text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <Button
          size="sm"
          variant={isUserFollowing ? "outline" : "default"}
          className={cn(
            "h-9 rounded-full shrink-0",
            isUserFollowing && "bg-muted text-foreground"
          )}
          onClick={(e) => {
            e.stopPropagation();
            toggleFollow(creator.id, creator.username);
          }}
        >
          {isUserFollowing ? 'Seguindo' : 'Seguir'}
        </Button>
      </div>
    </div>
  );
}
