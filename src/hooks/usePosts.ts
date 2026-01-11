import { useState, useCallback } from 'react';
import { Post } from '@/types';
import { mockPosts, currentUser } from '@/data/mockData';

export interface CreatePostData {
  content: string;
  mediaUrl?: string;
  mediaType: 'text' | 'image' | 'video';
  isPaid: boolean;
  price?: number;
  location?: string;
  taggedUsers?: string[];
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const addPost = useCallback((data: CreatePostData) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: currentUser,
      type: data.mediaType === 'text' ? 'text' : data.mediaType,
      content: data.content,
      mediaUrl: data.mediaUrl,
      isPaid: data.isPaid,
      price: data.price,
      location: data.location,
      taggedUsers: data.taggedUsers,
      isUnlocked: false,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isSaved: false,
      createdAt: new Date(),
    };

    setPosts(prev => [newPost, ...prev]);
    return newPost;
  }, []);

  const likePost = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  }, []);

  const unlockPost = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, isUnlocked: true };
      }
      return post;
    }));
  }, []);

  return {
    posts,
    addPost,
    likePost,
    unlockPost,
  };
};
