import { UserProfile } from '@/types';
import { useNavigate } from 'react-router-dom';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { BoostedBadge } from '@/components/BoostedBadge';
import { getProfileTypeLabel } from '@/data/mockData';
import { Rocket, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturedProfilesProps {
  currentUser: UserProfile;
  users: UserProfile[];
}

// Mock boosted users - in real app would come from backend
const boostedUserIds = ['2', '3'];

function ProfileChip({ 
  user, 
  onClick, 
  isBoosted = false 
}: { 
  user: UserProfile; 
  onClick: () => void;
  isBoosted?: boolean;
}) {
  return (
    <button onClick={onClick} className="flex-shrink-0">
      <div className={cn(
        "flex items-center gap-2 rounded-full border bg-background px-3 py-2 transition-all",
        isBoosted 
          ? "border-primary/50 bg-gradient-to-r from-primary/5 to-accent/5 shadow-sm" 
          : "border-border"
      )}>
        <div className="relative">
          <ProfileAvatar
            profileType={user.profileType}
            members={user.members}
            size="sm"
          />
          {isBoosted && (
            <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <Rocket className="h-2.5 w-2.5 text-white" />
            </div>
          )}
        </div>

        <div className="min-w-0 text-left">
          <p className="text-sm font-medium leading-none truncate max-w-[140px]">
            {user.username}
          </p>
          <p className="text-xs text-muted-foreground truncate max-w-[140px]">
            {isBoosted ? (
              <span className="text-primary font-medium">Em destaque</span>
            ) : (
              getProfileTypeLabel(user.profileType)
            )}
          </p>
        </div>
      </div>
    </button>
  );
}

function BoostedProfileCard({ 
  user, 
  onClick 
}: { 
  user: UserProfile; 
  onClick: () => void;
}) {
  return (
    <button 
      onClick={onClick} 
      className="flex-shrink-0 w-32 group"
    >
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 p-3 border border-primary/20 transition-all hover:scale-[1.02] hover:shadow-lg">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/20 rounded-full blur-2xl" />
        
        <div className="relative flex flex-col items-center">
          <div className="relative mb-2">
            <div className="ring-2 ring-primary/30 ring-offset-2 ring-offset-background rounded-full">
              <ProfileAvatar
                profileType={user.profileType}
                members={user.members}
                size="md"
              />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
              <BoostedBadge level="standard" size="sm" showLabel={false} />
            </div>
          </div>
          
          <p className="text-sm font-semibold truncate w-full text-center">
            {user.members?.[0]?.name || user.username}
          </p>
          <p className="text-[10px] text-primary font-medium flex items-center gap-0.5">
            <Sparkles className="h-2.5 w-2.5" />
            Destaque
          </p>
        </div>
      </div>
    </button>
  );
}

export function FeaturedProfiles({ currentUser, users }: FeaturedProfilesProps) {
  const navigate = useNavigate();
  
  const boostedUsers = users.filter(u => boostedUserIds.includes(u.id));
  const regularUsers = users.filter(u => !boostedUserIds.includes(u.id));

  return (
    <section className="py-3 border-b border-border">
      {/* Boosted Profiles Section */}
      {boostedUsers.length > 0 && (
        <div className="px-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <Rocket className="h-3.5 w-3.5 text-white" />
            </div>
            <h3 className="text-sm font-semibold">Perfis em Destaque</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {boostedUsers.map((user) => (
              <BoostedProfileCard
                key={user.id}
                user={user}
                onClick={() => navigate(`/profile/${user.id}`)}
              />
            ))}
          </div>
        </div>
      )}

    </section>
  );
}
