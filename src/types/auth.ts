import { ProfileType } from './index';

// Auth User - representa cada pessoa logada
export interface AuthUser {
  id: string;
  email: string;
  password: string; // Em produção, seria um hash
  memberName: string;
  memberAvatar: string;
  profileId: string; // ID do perfil compartilhado
  role: 'owner' | 'member';
  createdAt: Date;
}

// Perfil compartilhado - onde múltiplos usuários podem acessar
export interface SharedProfile {
  id: string;
  username: string;
  profileType: ProfileType;
  coverPhoto: string;
  bio: string;
  followers: number;
  following: number;
  postsCount: number;
  isVerified: boolean;
  subscriptionPlanId?: string;
  subscriptionTier?: 'free' | 'basic' | 'intermediate' | 'premium';
  trialEndsAt?: Date;
  createdAt: Date;
}

// Convite para entrar no perfil
export interface ProfileInvitation {
  id: string;
  profileId: string;
  profileUsername: string;
  invitedByName: string;
  invitedEmail: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}

// Dados da sessão atual
export interface AuthSession {
  user: AuthUser;
  profile: SharedProfile;
  allMembers: AuthUser[]; // Todos os membros do perfil
}

// Para criação de perfil
export interface CreateProfileData {
  profileType: ProfileType;
  username: string;
  bio?: string;
  memberName: string;
  memberAvatar?: string;
  email: string;
  password: string;
  subscriptionPlanId?: string;
}

// Para convite de membro
export interface InviteMemberData {
  email: string;
  profileId: string;
}

// Para aceitar convite
export interface AcceptInviteData {
  invitationId: string;
  memberName: string;
  memberAvatar?: string;
  email: string;
  password: string;
}
