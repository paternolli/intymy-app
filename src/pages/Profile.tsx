import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { CreatePostSheet } from '@/components/CreatePostSheet';
import { ProfileAvatar, ProfileNames } from '@/components/ProfileAvatar';
import { CreatorStoreTab } from '@/components/CreatorStoreTab';
import { ProfileBoostSheet } from '@/components/ProfileBoostSheet';
import { ProfileActionsSheet } from '@/components/ProfileActionsSheet';
import { SubscriptionUpgradeCard } from '@/components/SubscriptionUpgradeCard';
import { BoostedBadge } from '@/components/BoostedBadge';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Grid3X3, Bookmark, Lock, MoreHorizontal, ImageIcon, ShoppingBag, Rocket, Crown } from 'lucide-react';
import { mockUsers, currentUser, mockPosts, getProfileTypeLabel } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useUserRelationships } from '@/hooks/useUserRelationships';
import { useAuth } from '@/contexts/AuthContext';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'store' | 'saved'>('posts');
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const {
    isFollowing,
    toggleFollow,
    isBlocked,
    toggleBlock,
    isRestricted,
    toggleRestrict,
    report,
  } = useUserRelationships();

  const user = id ? mockUsers.find(u => u.id === id) || currentUser : currentUser;
  const isOwnProfile = !id || user.id === currentUser.id;
  const userPosts = mockPosts.filter(p => p.author.id === user.id);
  
  // Check relationship status for this user
  const userIsFollowed = isFollowing(user.id);
  const userIsBlocked = isBlocked(user.id);
  const userIsRestricted = isRestricted(user.id);
  
  // Mock boost status - in real app would come from backend
  const isProfileBoosted = user.id === currentUser.id; // Mock: current user has boost
  const boostLevel = 'standard' as const;

  return (
    <div className="min-h-screen bg-background pb-14">
      {/* Cover Photo */}
      <div className="relative h-44 bg-muted">
        <img 
          src={user.coverPhoto} 
          alt="Capa" 
          className="w-full h-full object-cover"
        />
        
        {/* Top navigation overlay */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          {id ? (
            <button 
              onClick={() => navigate(-1)}
              className="h-9 w-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
          ) : (
            <div />
          )}
          
          <button 
            onClick={() => isOwnProfile ? navigate('/settings') : setIsActionsOpen(true)}
            className="h-9 w-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
          >
            {isOwnProfile ? (
              <Settings className="h-5 w-5 text-white" />
            ) : (
              <MoreHorizontal className="h-5 w-5 text-white" />
            )}
          </button>
        </div>

        {/* Edit cover button for own profile */}
        {isOwnProfile && (
          <button className="absolute bottom-3 right-3 h-8 px-3 rounded-full bg-black/30 backdrop-blur-sm flex items-center gap-1.5 text-white text-xs">
            <ImageIcon className="h-3.5 w-3.5" />
            Editar
          </button>
        )}
      </div>

      <main className="max-w-lg mx-auto px-4">
        {/* Avatar - overlapping cover */}
        <div className="flex justify-between items-end -mt-12 mb-4">
          <div className="p-1 bg-background rounded-full">
            <ProfileAvatar
              profileType={user.profileType}
              members={user.members}
              size="xl"
            />
          </div>
          
          {/* Action button */}
          {isOwnProfile ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="h-9 rounded-full"
                onClick={() => navigate('/subscriptions')}
              >
                Editar perfil
              </Button>
              <ProfileBoostSheet isActive={isProfileBoosted} remainingTime="23h 45min">
                <Button 
                  size="sm"
                  className="h-9 rounded-full gap-1.5 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  <Rocket className="h-4 w-4" />
                  Destacar
                </Button>
              </ProfileBoostSheet>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button 
                size="sm"
                className={cn(
                  "h-9 rounded-full",
                  userIsFollowed && "bg-muted text-foreground hover:bg-muted"
                )}
                variant={userIsFollowed ? "outline" : "default"}
                onClick={() => toggleFollow(user.id, user.username)}
              >
                {userIsFollowed ? 'Seguindo' : 'Seguir'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="h-9 rounded-full"
                onClick={() => navigate('/chat')}
              >
                Mensagem
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => navigate(`/store/${user.id}`)}
              >
                <ShoppingBag className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Name & Info */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-lg font-semibold flex items-center gap-1.5">
              <ProfileNames members={user.members} />
              {user.isVerified && <VerifiedBadge size="md" />}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {getProfileTypeLabel(user.profileType)}
            </span>
            {isProfileBoosted && <BoostedBadge level={boostLevel} size="sm" />}
          </div>
          <p className="text-sm text-muted-foreground mb-2">@{user.username}</p>
          <p className="text-sm">{user.bio}</p>
        </div>

        {/* Subscription Card - Only for own profile */}
        {isOwnProfile && (
          <div className="mb-6">
            <SubscriptionUpgradeCard 
              currentTier={session?.profile?.subscriptionTier || user.subscriptionTier || 'free'} 
            />
          </div>
        )}

        {/* Stats - horizontal cards style */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1 bg-muted/50 rounded-xl py-3 text-center">
            <p className="text-lg font-semibold">{user.postsCount}</p>
            <p className="text-xs text-muted-foreground">publicações</p>
          </div>
          <div className="flex-1 bg-muted/50 rounded-xl py-3 text-center">
            <p className="text-lg font-semibold">{user.followers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">seguidores</p>
          </div>
          <div className="flex-1 bg-muted/50 rounded-xl py-3 text-center">
            <p className="text-lg font-semibold">{user.following}</p>
            <p className="text-xs text-muted-foreground">seguindo</p>
          </div>
        </div>

        {/* Tabs - pill style */}
        <div className="flex gap-2 mb-4">
          <button 
            className={cn(
              "flex-1 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2",
              activeTab === 'posts' 
                ? "bg-foreground text-background" 
                : "bg-muted text-muted-foreground"
            )}
            onClick={() => setActiveTab('posts')}
          >
            <Grid3X3 className="h-4 w-4" />
            Posts
          </button>
          {isOwnProfile && (
            <button 
              className={cn(
                "flex-1 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2",
                activeTab === 'store' 
                  ? "bg-foreground text-background" 
                  : "bg-muted text-muted-foreground"
              )}
              onClick={() => setActiveTab('store')}
            >
              <ShoppingBag className="h-4 w-4" />
              Loja
            </button>
          )}
          <button 
            className={cn(
              "flex-1 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2",
              activeTab === 'saved' 
                ? "bg-foreground text-background" 
                : "bg-muted text-muted-foreground"
            )}
            onClick={() => setActiveTab('saved')}
          >
            <Bookmark className="h-4 w-4" />
            Salvos
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'posts' && (
          <div className="grid grid-cols-2 gap-2">
            {userPosts.map((post) => (
              <div 
                key={post.id} 
                className="aspect-[4/5] bg-muted rounded-xl overflow-hidden relative"
              >
                {post.mediaUrl ? (
                  <>
                    <img 
                      src={post.mediaUrl} 
                      alt="" 
                      className={cn(
                        "w-full h-full object-cover",
                        post.isPaid && !post.isUnlocked && "blur-content"
                      )}
                    />
                    {post.isPaid && !post.isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Lock className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4 bg-muted">
                    <p className="text-sm text-center line-clamp-4">{post.content}</p>
                  </div>
                )}
              </div>
            ))}
            {userPosts.length === 0 && (
              <div className="col-span-2 py-16 text-center text-muted-foreground">
                <Grid3X3 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Nenhuma publicação ainda</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'store' && (
          <CreatorStoreTab isOwnProfile={isOwnProfile} userId={user.id} />
        )}

        {activeTab === 'saved' && (
          <div className="py-16 text-center text-muted-foreground">
            <Bookmark className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Itens salvos aparecerão aqui</p>
          </div>
        )}
      </main>

      <BottomNav onCreateClick={() => setIsCreateOpen(true)} />
      <CreatePostSheet open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      
      {/* Profile Actions Sheet for other profiles */}
      {!isOwnProfile && (
        <ProfileActionsSheet
          open={isActionsOpen}
          onOpenChange={setIsActionsOpen}
          userId={user.id}
          username={user.username}
          isFollowing={userIsFollowed}
          isBlocked={userIsBlocked}
          isRestricted={userIsRestricted}
          onToggleFollow={() => toggleFollow(user.id, user.username)}
          onToggleBlock={() => toggleBlock(user.id, user.username)}
          onToggleRestrict={() => toggleRestrict(user.id, user.username)}
          onReport={(reason) => report(user.id, reason, user.username)}
        />
      )}
    </div>
  );
}
