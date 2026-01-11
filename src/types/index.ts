// Profile Types
export type ProfileType = 'single' | 'dating' | 'couple' | 'throuple';

export interface ProfileMember {
  id: string;
  name: string;
  avatar: string;
}

export interface UserProfile {
  id: string;
  username: string;
  profileType: ProfileType;
  members: ProfileMember[];
  coverPhoto: string;
  bio: string;
  followers: number;
  following: number;
  postsCount: number;
  isVerified?: boolean;
  subscriptionTier?: SubscriptionTier;
}

// Post Types
export type PostType = 'text' | 'image' | 'video';

export interface PostComment {
  id: string;
  author: UserProfile;
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: Date;
  replies?: PostComment[];
}

export interface Post {
  id: string;
  author: UserProfile;
  type: PostType;
  content: string;
  mediaUrl?: string;
  isPaid: boolean;
  price?: number;
  isUnlocked?: boolean;
  location?: string;
  taggedUsers?: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: Date;
  commentsList?: PostComment[];
}

// Subscription Types
export type SubscriptionTier = 'free' | 'basic' | 'intermediate' | 'premium';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  period: 'monthly' | 'yearly' | 'once';
  features: string[];
  isPopular?: boolean;
  trialDays?: number;
}

// Chat Types
export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participant: UserProfile;
  lastMessage: ChatMessage;
  unreadCount: number;
}

// Store Types
export type ProductCategory = 
  | 'photo' 
  | 'video' 
  | 'bundle' 
  | 'subscription' 
  | 'custom' 
  | 'polaroid' 
  | 'merchandise' 
  | 'collectible';

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  type: 'digital' | 'physical';
  category: ProductCategory;
  imageUrl: string;
  images?: string[];
  isAvailable: boolean;
  isFeatured?: boolean;
  isBlurred?: boolean;
  blurPrice?: number;
  stock?: number;
  downloadUrl?: string;
  previewUrl?: string;
}

// Creator Store Types
export interface CreatorStore {
  id: string;
  creatorId: string;
  name: string;
  description: string;
  coverImage: string;
  products: Product[];
  subscriptionPlans: SubscriptionPlan[];
  totalSales: number;
  rating: number;
}
