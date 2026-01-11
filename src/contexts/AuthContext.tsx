import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  AuthUser, 
  SharedProfile, 
  AuthSession, 
  CreateProfileData, 
  ProfileInvitation,
  AcceptInviteData,
} from '@/types/auth';
import { ProfileType } from '@/types';

interface AuthContextType {
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Auth actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  createProfile: (data: CreateProfileData) => Promise<{ success: boolean; error?: string }>;
  
  // Profile member management
  inviteMember: (email: string) => Promise<{ success: boolean; error?: string; invitation?: ProfileInvitation }>;
  acceptInvitation: (data: AcceptInviteData) => Promise<{ success: boolean; error?: string }>;
  removeMember: (memberId: string) => Promise<{ success: boolean; error?: string }>;
  getInvitations: () => ProfileInvitation[];
  getPendingInvitations: (email: string) => ProfileInvitation[];
  
  // Profile updates
  updateProfile: (data: Partial<SharedProfile>) => void;
  updateMember: (memberId: string, data: Partial<Pick<AuthUser, 'memberName' | 'memberAvatar'>>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'intymy_users',
  PROFILES: 'intymy_profiles',
  INVITATIONS: 'intymy_invitations',
  CURRENT_SESSION: 'intymy_session',
};

// Helper functions for localStorage
function getStoredUsers(): AuthUser[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function getStoredProfiles(): SharedProfile[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function getStoredInvitations(): ProfileInvitation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INVITATIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function getStoredSession(): AuthSession | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function setStoredUsers(users: AuthUser[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function setStoredProfiles(profiles: SharedProfile[]): void {
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
}

function setStoredInvitations(invitations: ProfileInvitation[]): void {
  localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(invitations));
}

function setStoredSession(session: AuthSession | null): void {
  if (session) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    const storedSession = getStoredSession();
    if (storedSession) {
      // Verify user still exists
      const users = getStoredUsers();
      const userExists = users.find(u => u.id === storedSession.user.id);
      if (userExists) {
        setSession(storedSession);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return { success: false, error: 'Usuário não encontrado' };
    }
    
    if (user.password !== password) {
      return { success: false, error: 'Senha incorreta' };
    }
    
    const profiles = getStoredProfiles();
    const profile = profiles.find(p => p.id === user.profileId);
    
    if (!profile) {
      return { success: false, error: 'Perfil não encontrado' };
    }
    
    const allMembers = users.filter(u => u.profileId === profile.id);
    
    const newSession: AuthSession = {
      user,
      profile,
      allMembers,
    };
    
    setSession(newSession);
    setStoredSession(newSession);
    
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    setStoredSession(null);
  }, []);

  const createProfile = useCallback(async (data: CreateProfileData): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();
    const profiles = getStoredProfiles();
    
    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'Este e-mail já está em uso' };
    }
    
    // Check if username already exists
    if (profiles.find(p => p.username.toLowerCase() === data.username.toLowerCase())) {
      return { success: false, error: 'Este nome de usuário já está em uso' };
    }
    
    // Determine subscription tier from plan ID
    const planTierMap: Record<string, 'free' | 'basic' | 'intermediate' | 'premium'> = {
      'plano_free': 'free',
      'plano_basico': 'basic',
      'plano_intermediario': 'intermediate',
      'plano_premium': 'premium',
    };
    
    const subscriptionTier = data.subscriptionPlanId 
      ? planTierMap[data.subscriptionPlanId] || 'free'
      : 'free';
    
    // Calculate trial end date for paid plans (7 days from now)
    const trialEndsAt = subscriptionTier !== 'free' 
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
      : undefined;
    
    // Create profile
    const newProfile: SharedProfile = {
      id: `profile_${Date.now()}`,
      username: data.username,
      profileType: data.profileType,
      coverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=300&fit=crop',
      bio: data.bio || '',
      followers: 0,
      following: 0,
      postsCount: 0,
      isVerified: false,
      subscriptionPlanId: data.subscriptionPlanId,
      subscriptionTier,
      trialEndsAt,
      createdAt: new Date(),
    };
    
    // Create user
    const newUser: AuthUser = {
      id: `user_${Date.now()}`,
      email: data.email,
      password: data.password,
      memberName: data.memberName,
      memberAvatar: data.memberAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      profileId: newProfile.id,
      role: 'owner',
      createdAt: new Date(),
    };
    
    // Save to storage
    profiles.push(newProfile);
    users.push(newUser);
    setStoredProfiles(profiles);
    setStoredUsers(users);
    
    // Create session
    const newSession: AuthSession = {
      user: newUser,
      profile: newProfile,
      allMembers: [newUser],
    };
    
    setSession(newSession);
    setStoredSession(newSession);
    
    return { success: true };
  }, []);

  const inviteMember = useCallback(async (email: string): Promise<{ success: boolean; error?: string; invitation?: ProfileInvitation }> => {
    if (!session) {
      return { success: false, error: 'Não autenticado' };
    }
    
    if (session.user.role !== 'owner') {
      return { success: false, error: 'Apenas o dono do perfil pode convidar membros' };
    }
    
    // Check max members based on profile type
    const maxMembers: Record<ProfileType, number> = {
      single: 1,
      dating: 2,
      couple: 2,
      throuple: 3,
    };
    
    if (session.allMembers.length >= maxMembers[session.profile.profileType]) {
      return { success: false, error: `Este tipo de perfil permite no máximo ${maxMembers[session.profile.profileType]} membro(s)` };
    }
    
    const invitations = getStoredInvitations();
    
    // Check if email already in profile
    if (session.allMembers.find(m => m.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Esta pessoa já faz parte do perfil' };
    }
    
    // Check if email already has pending invitation
    const pendingInvite = invitations.find(
      i => i.invitedEmail.toLowerCase() === email.toLowerCase() && 
           i.profileId === session.profile.id && 
           i.status === 'pending'
    );
    if (pendingInvite) {
      return { success: false, error: 'Já existe um convite pendente para este e-mail' };
    }
    
    // Create invitation
    const newInvitation: ProfileInvitation = {
      id: `invite_${Date.now()}`,
      profileId: session.profile.id,
      profileUsername: session.profile.username,
      invitedByName: session.user.memberName,
      invitedEmail: email,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };
    
    invitations.push(newInvitation);
    setStoredInvitations(invitations);
    
    return { success: true, invitation: newInvitation };
  }, [session]);

  const acceptInvitation = useCallback(async (data: AcceptInviteData): Promise<{ success: boolean; error?: string }> => {
    const invitations = getStoredInvitations();
    const users = getStoredUsers();
    const profiles = getStoredProfiles();
    
    const invitation = invitations.find(i => i.id === data.invitationId);
    
    if (!invitation) {
      return { success: false, error: 'Convite não encontrado' };
    }
    
    if (invitation.status !== 'pending') {
      return { success: false, error: 'Este convite já foi usado ou expirou' };
    }
    
    if (new Date() > new Date(invitation.expiresAt)) {
      invitation.status = 'expired';
      setStoredInvitations(invitations);
      return { success: false, error: 'Este convite expirou' };
    }
    
    // Check if email matches
    if (invitation.invitedEmail.toLowerCase() !== data.email.toLowerCase()) {
      return { success: false, error: 'O e-mail não corresponde ao convite' };
    }
    
    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'Este e-mail já está em uso' };
    }
    
    const profile = profiles.find(p => p.id === invitation.profileId);
    if (!profile) {
      return { success: false, error: 'Perfil não encontrado' };
    }
    
    // Create new user as member
    const newUser: AuthUser = {
      id: `user_${Date.now()}`,
      email: data.email,
      password: data.password,
      memberName: data.memberName,
      memberAvatar: data.memberAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      profileId: invitation.profileId,
      role: 'member',
      createdAt: new Date(),
    };
    
    // Update invitation status
    invitation.status = 'accepted';
    
    // Save
    users.push(newUser);
    setStoredUsers(users);
    setStoredInvitations(invitations);
    
    // Create session
    const allMembers = users.filter(u => u.profileId === profile.id);
    const newSession: AuthSession = {
      user: newUser,
      profile,
      allMembers,
    };
    
    setSession(newSession);
    setStoredSession(newSession);
    
    return { success: true };
  }, []);

  const removeMember = useCallback(async (memberId: string): Promise<{ success: boolean; error?: string }> => {
    if (!session) {
      return { success: false, error: 'Não autenticado' };
    }
    
    if (session.user.role !== 'owner') {
      return { success: false, error: 'Apenas o dono pode remover membros' };
    }
    
    if (memberId === session.user.id) {
      return { success: false, error: 'Você não pode remover a si mesmo' };
    }
    
    const users = getStoredUsers();
    const updatedUsers = users.filter(u => u.id !== memberId);
    setStoredUsers(updatedUsers);
    
    // Update session
    const allMembers = updatedUsers.filter(u => u.profileId === session.profile.id);
    const newSession: AuthSession = {
      ...session,
      allMembers,
    };
    setSession(newSession);
    setStoredSession(newSession);
    
    return { success: true };
  }, [session]);

  const getInvitations = useCallback((): ProfileInvitation[] => {
    if (!session) return [];
    const invitations = getStoredInvitations();
    return invitations.filter(i => i.profileId === session.profile.id);
  }, [session]);

  const getPendingInvitations = useCallback((email: string): ProfileInvitation[] => {
    const invitations = getStoredInvitations();
    return invitations.filter(
      i => i.invitedEmail.toLowerCase() === email.toLowerCase() && 
           i.status === 'pending' &&
           new Date(i.expiresAt) > new Date()
    );
  }, []);

  const updateProfile = useCallback((data: Partial<SharedProfile>) => {
    if (!session) return;
    
    const profiles = getStoredProfiles();
    const profileIndex = profiles.findIndex(p => p.id === session.profile.id);
    
    if (profileIndex !== -1) {
      profiles[profileIndex] = { ...profiles[profileIndex], ...data };
      setStoredProfiles(profiles);
      
      const newSession = {
        ...session,
        profile: profiles[profileIndex],
      };
      setSession(newSession);
      setStoredSession(newSession);
    }
  }, [session]);

  const updateMember = useCallback((memberId: string, data: Partial<Pick<AuthUser, 'memberName' | 'memberAvatar'>>) => {
    if (!session) return;
    
    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === memberId);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...data };
      setStoredUsers(users);
      
      const allMembers = users.filter(u => u.profileId === session.profile.id);
      const currentUser = memberId === session.user.id ? users[userIndex] : session.user;
      
      const newSession: AuthSession = {
        ...session,
        user: currentUser,
        allMembers,
      };
      setSession(newSession);
      setStoredSession(newSession);
    }
  }, [session]);

  return (
    <AuthContext.Provider 
      value={{
        session,
        isLoading,
        isAuthenticated: !!session,
        login,
        logout,
        createProfile,
        inviteMember,
        acceptInvitation,
        removeMember,
        getInvitations,
        getPendingInvitations,
        updateProfile,
        updateMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
