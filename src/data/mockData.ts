import { UserProfile, Post, SubscriptionPlan, Conversation, ChatMessage, Product } from '@/types';
import { Story, UserStories } from '@/components/StoriesBar';

// Mock Users
export const mockUsers: UserProfile[] = [
  {
    id: '1',
    username: 'julia_santos',
    profileType: 'single',
    members: [{ id: '1a', name: 'Julia Santos', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' }],
    coverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=300&fit=crop',
    bio: '✨ Vivendo a vida intensamente',
    followers: 1234,
    following: 567,
    postsCount: 89,
    isVerified: true,
    subscriptionTier: 'premium',
  },
  {
    id: '2',
    username: 'casal_feliz',
    profileType: 'couple',
    members: [
      { id: '2a', name: 'Pedro', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
      { id: '2b', name: 'Maria', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
    ],
    coverPhoto: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=300&fit=crop',
    bio: '💕 Juntos há 3 anos | Compartilhando nosso amor',
    followers: 5678,
    following: 234,
    postsCount: 156,
    isVerified: true,
    subscriptionTier: 'premium',
  },
  {
    id: '3',
    username: 'ana_namorando',
    profileType: 'dating',
    members: [
      { id: '3a', name: 'Ana', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' },
      { id: '3b', name: 'Lucas', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
    ],
    coverPhoto: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=300&fit=crop',
    bio: '💘 Fase boa demais',
    followers: 890,
    following: 445,
    postsCount: 45,
    subscriptionTier: 'basic',
  },
  {
    id: '4',
    username: 'trisal_amor',
    profileType: 'throuple',
    members: [
      { id: '4a', name: 'Carla', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
      { id: '4b', name: 'Bruno', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
      { id: '4c', name: 'Fernanda', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop' },
    ],
    coverPhoto: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=300&fit=crop',
    bio: '💜 Três corações, um só amor',
    followers: 3456,
    following: 123,
    postsCount: 78,
    isVerified: true,
    subscriptionTier: 'premium',
  },
  {
    id: '5',
    username: 'marcos_single',
    profileType: 'single',
    members: [{ id: '5a', name: 'Marcos Silva', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }],
    coverPhoto: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=300&fit=crop',
    bio: '🎸 Músico | Criador de conteúdo',
    followers: 2345,
    following: 678,
    postsCount: 234,
    subscriptionTier: 'premium',
  },
];

// Current logged user
export const currentUser: UserProfile = mockUsers[0];

// Mock Posts
export const mockPosts: Post[] = [
  {
    id: 'p1',
    author: mockUsers[1],
    type: 'image',
    content: 'Nosso final de semana perfeito! 🌅💕',
    mediaUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=600&fit=crop',
    isPaid: false,
    likes: 456,
    comments: 23,
    shares: 12,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
  },
  {
    id: 'p2',
    author: mockUsers[0],
    type: 'text',
    content: 'Às vezes a gente precisa parar e agradecer por tudo que conquistamos. Hoje é um desses dias. 🙏✨\n\nGrata por cada pessoa que faz parte da minha jornada!',
    isPaid: false,
    likes: 234,
    comments: 45,
    shares: 8,
    isLiked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: 'p3',
    author: mockUsers[3],
    type: 'image',
    content: 'Conteúdo exclusivo! Desbloqueie para ver 🔥',
    mediaUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=600&fit=crop',
    isPaid: true,
    price: 19.90,
    isUnlocked: false,
    likes: 789,
    comments: 56,
    shares: 34,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    id: 'p4',
    author: mockUsers[2],
    type: 'image',
    content: 'Primeiro mês juntos! 💘',
    mediaUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=600&fit=crop',
    isPaid: false,
    likes: 567,
    comments: 89,
    shares: 23,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
  },
  {
    id: 'p5',
    author: mockUsers[4],
    type: 'video',
    content: 'Nova música saindo do forno! 🎸🔥 Link na bio',
    mediaUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop',
    isPaid: false,
    likes: 1234,
    comments: 156,
    shares: 89,
    isLiked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: 'p6',
    author: mockUsers[1],
    type: 'image',
    content: 'Ensaio especial 📸 Exclusivo para assinantes!',
    mediaUrl: 'https://images.unsplash.com/photo-1621784563330-caee0b138a00?w=600&h=600&fit=crop',
    isPaid: true,
    price: 29.90,
    isUnlocked: false,
    likes: 2345,
    comments: 234,
    shares: 67,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
  },
];

// Subscription Plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plano_free',
    name: '👀 O Curioso',
    tier: 'free',
    price: 0,
    period: 'monthly',
    features: [
      'Acesso básico a fotos e vídeos iniciais',
      'Criar perfil personalizado',
      'Enviar mensagens (limite de 10/dia)',
      'Curtir e comentar publicações',
      'Explorar criadores',
    ],
  },
  {
    id: 'plano_basico',
    name: '💖 O Admirador',
    tier: 'basic',
    price: 24.90,
    period: 'monthly',
    trialDays: 7,
    features: [
      'Tudo do plano Curioso',
      'Acesso ilimitado ao conteúdo',
      'Conteúdo exclusivo semanal',
      'Mensagens ilimitadas',
      'Ver quem visitou seu perfil',
      'Selo de assinante',
    ],
  },
  {
    id: 'plano_intermediario',
    name: '🌟 O VIP',
    tier: 'intermediate',
    price: 59.90,
    period: 'monthly',
    trialDays: 7,
    features: [
      'Tudo do plano Admirador',
      'Conteúdo em HD',
      'Prioridade no chat',
      'Surpresas mensais exclusivas',
      'Destaque no feed',
      'Estatísticas avançadas',
      'Suporte prioritário',
    ],
    isPopular: true,
  },
  {
    id: 'plano_premium',
    name: '💎 O Diamante',
    tier: 'premium',
    price: 119.90,
    period: 'monthly',
    trialDays: 7,
    features: [
      'Tudo do plano VIP',
      'Conteúdo personalizado',
      'Acesso antecipado a novidades',
      '1 conteúdo pago grátis/mês',
      'Lives exclusivas',
      'Grupo VIP exclusivo',
      'Verificação especial',
      'Badge Diamante',
    ],
  },
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    participant: mockUsers[1],
    lastMessage: {
      id: 'm1',
      senderId: mockUsers[1].id,
      content: 'Oi! Amei seu último post 💕',
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
      isRead: false,
    },
    unreadCount: 2,
  },
  {
    id: 'c2',
    participant: mockUsers[3],
    lastMessage: {
      id: 'm2',
      senderId: currentUser.id,
      content: 'Quando vocês vão postar mais?',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true,
    },
    unreadCount: 0,
  },
  {
    id: 'c3',
    participant: mockUsers[4],
    lastMessage: {
      id: 'm3',
      senderId: mockUsers[4].id,
      content: 'Valeu pelo apoio! 🙏',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isRead: true,
    },
    unreadCount: 0,
  },
];

// Helper function to get profile type label
export const getProfileTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    single: 'Solteiro(a)',
    dating: 'Namorando',
    couple: 'Casal',
    throuple: 'Trisal',
  };
  return labels[type] || type;
};

// Format time ago
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString('pt-BR');
};

// Generate mock stories
const generateMockStories = (user: UserProfile, count: number): Story[] => {
  const storyImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1540206395-68808572332f?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
  ];

  return Array.from({ length: count }, (_, i) => {
    const hoursAgo = Math.floor(Math.random() * 20) + 1;
    const createdAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
    
    return {
      id: `story-${user.id}-${i}`,
      author: user,
      mediaUrl: storyImages[Math.floor(Math.random() * storyImages.length)],
      mediaType: 'image' as const,
      createdAt,
      expiresAt,
      views: Math.floor(Math.random() * 500) + 50,
      isViewed: Math.random() > 0.5,
    };
  });
};

// Mock Stories Data
export const mockUserStories: UserStories[] = [
  {
    user: mockUsers[1], // casal_feliz
    stories: generateMockStories(mockUsers[1], 3),
    hasUnviewed: true,
  },
  {
    user: mockUsers[3], // trisal_amor
    stories: generateMockStories(mockUsers[3], 2),
    hasUnviewed: true,
  },
  {
    user: mockUsers[2], // ana_namorando
    stories: generateMockStories(mockUsers[2], 1),
    hasUnviewed: false,
  },
  {
    user: mockUsers[4], // marcos_single
    stories: generateMockStories(mockUsers[4], 4),
    hasUnviewed: true,
  },
];

// Mock Creator Products
export const mockCreatorProducts: Product[] = [
  // Digital Products
  {
    id: 'prod1',
    sellerId: '1',
    title: 'Pack Exclusivo - 10 Fotos HD',
    description: 'Ensaio fotográfico profissional com 10 fotos em alta resolução',
    price: 49.90,
    type: 'digital',
    category: 'bundle',
    imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop',
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 'prod2',
    sellerId: '1',
    title: 'Foto Exclusiva',
    description: 'Uma foto especial do último ensaio',
    price: 9.90,
    type: 'digital',
    category: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    isAvailable: true,
  },
  {
    id: 'prod3',
    sellerId: '1',
    title: 'Vídeo Making Of',
    description: 'Bastidores do ensaio em vídeo exclusivo',
    price: 29.90,
    type: 'digital',
    category: 'video',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=400&fit=crop',
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 'prod4',
    sellerId: '1',
    title: 'Assinatura Mensal VIP',
    description: 'Acesso a todo conteúdo exclusivo por 30 dias',
    price: 79.90,
    type: 'digital',
    category: 'subscription',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 'prod5',
    sellerId: '1',
    title: 'Conteúdo Personalizado',
    description: 'Encomende um conteúdo feito especialmente para você',
    price: 149.90,
    type: 'digital',
    category: 'custom',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
    isAvailable: true,
  },
  {
    id: 'prod6',
    sellerId: '1',
    title: 'Pack Vídeos - 5 Clipes',
    description: 'Coleção com 5 vídeos curtos exclusivos',
    price: 69.90,
    type: 'digital',
    category: 'bundle',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    isAvailable: true,
  },
  // Physical Products
  {
    id: 'prod7',
    sellerId: '1',
    title: 'Polaroid Autografada',
    description: 'Foto polaroid exclusiva com autógrafo',
    price: 39.90,
    type: 'physical',
    category: 'polaroid',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
    isAvailable: true,
    stock: 15,
    isFeatured: true,
  },
  {
    id: 'prod8',
    sellerId: '1',
    title: 'Camiseta Exclusiva',
    description: 'Camiseta oficial com estampa especial',
    price: 89.90,
    type: 'physical',
    category: 'merchandise',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    isAvailable: true,
    stock: 20,
  },
  {
    id: 'prod9',
    sellerId: '1',
    title: 'Item Colecionável',
    description: 'Peça exclusiva de colecionador numerada',
    price: 199.90,
    type: 'physical',
    category: 'collectible',
    imageUrl: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop',
    isAvailable: true,
    stock: 5,
    isFeatured: true,
  },
  {
    id: 'prod10',
    sellerId: '1',
    title: 'Conjunto Polaroids',
    description: 'Kit com 3 polaroids exclusivas',
    price: 99.90,
    type: 'physical',
    category: 'polaroid',
    imageUrl: 'https://images.unsplash.com/photo-1527768664975-ba9ad4a8d5de?w=400&h=400&fit=crop',
    isAvailable: true,
    stock: 10,
  },
  {
    id: 'prod11',
    sellerId: '1',
    title: 'Caneca Personalizada',
    description: 'Caneca com foto exclusiva',
    price: 59.90,
    type: 'physical',
    category: 'merchandise',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop',
    isAvailable: true,
    stock: 30,
  },
  {
    id: 'prod12',
    sellerId: '1',
    title: 'Poster Assinado',
    description: 'Poster A3 com autógrafo',
    price: 79.90,
    type: 'physical',
    category: 'collectible',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    isAvailable: true,
    stock: 8,
  },
];
