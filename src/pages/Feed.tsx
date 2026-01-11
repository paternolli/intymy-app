import { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { PostCard } from '@/components/PostCard';
import { CreatePostSheet } from '@/components/CreatePostSheet';
import { FeaturedProfiles } from '@/components/FeaturedProfiles';
import { StoriesBar, UserStories, Story } from '@/components/StoriesBar';
import { mockUsers, currentUser, mockUserStories } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { usePosts, CreatePostData } from '@/hooks/usePosts';

export default function Feed() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [userStories, setUserStories] = useState<UserStories[]>(mockUserStories);
  const { toast } = useToast();
  const { posts, addPost, unlockPost } = usePosts();

  const handleUnlock = (postId: string, price: number) => {
    // Simulate payment
    toast({
      title: 'Processando pagamento...',
      description: `Desbloqueando conteúdo por R$ ${price.toFixed(2)}`,
    });
    
    setTimeout(() => {
      unlockPost(postId);
      toast({
        title: 'Conteúdo desbloqueado!',
        description: 'Você agora tem acesso completo a este conteúdo.',
      });
    }, 1500);
  };

  const handleCreatePost = (data: CreatePostData) => {
    addPost(data);
  };

  const handleAddStory = (mediaUrl: string, mediaType: 'image' | 'video') => {
    const now = new Date();
    const newStory: Story = {
      id: `story-${currentUser.id}-${Date.now()}`,
      author: currentUser,
      mediaUrl,
      mediaType,
      createdAt: now,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      views: 0,
      isViewed: true,
    };

    setUserStories(prev => {
      const existingUserStories = prev.find(us => us.user.id === currentUser.id);
      
      if (existingUserStories) {
        return prev.map(us => 
          us.user.id === currentUser.id
            ? { ...us, stories: [newStory, ...us.stories], hasUnviewed: true }
            : us
        );
      } else {
        return [
          { user: currentUser, stories: [newStory], hasUnviewed: true },
          ...prev,
        ];
      }
    });
  };

  return (
    <div className="min-h-screen bg-background pb-14">
      <Header />
      
      <main className="max-w-lg mx-auto">
        {/* Stories Bar */}
        <StoriesBar
          currentUser={currentUser}
          userStories={userStories}
          onAddStory={handleAddStory}
        />

        {/* Featured Profiles - Unique Card Layout */}
        <FeaturedProfiles currentUser={currentUser} users={mockUsers} />

        {/* Feed */}
        {posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post}
            onUnlock={handleUnlock}
          />
        ))}
      </main>

      <BottomNav onCreateClick={() => setIsCreateOpen(true)} />
      <CreatePostSheet 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onCreatePost={handleCreatePost}
      />
    </div>
  );
}
