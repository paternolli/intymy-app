import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface UserRelationships {
  following: string[];
  followers: string[];
  blocked: string[];
  restricted: string[];
  reported: string[];
}

const STORAGE_KEY = 'intymy_user_relationships';

function getStoredRelationships(): UserRelationships {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {
      following: [],
      followers: [],
      blocked: [],
      restricted: [],
      reported: [],
    };
  } catch {
    return {
      following: [],
      followers: [],
      blocked: [],
      restricted: [],
      reported: [],
    };
  }
}

function setStoredRelationships(relationships: UserRelationships): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(relationships));
}

export function useUserRelationships() {
  const [relationships, setRelationships] = useState<UserRelationships>(getStoredRelationships);

  // Sync with localStorage
  useEffect(() => {
    setStoredRelationships(relationships);
  }, [relationships]);

  // Follow/Unfollow
  const isFollowing = useCallback((userId: string): boolean => {
    return relationships.following.includes(userId);
  }, [relationships.following]);

  const follow = useCallback((userId: string, username?: string) => {
    setRelationships(prev => {
      if (prev.following.includes(userId)) return prev;
      return {
        ...prev,
        following: [...prev.following, userId],
      };
    });
    toast.success(`Você começou a seguir ${username || 'este perfil'}!`);
  }, []);

  const unfollow = useCallback((userId: string, username?: string) => {
    setRelationships(prev => ({
      ...prev,
      following: prev.following.filter(id => id !== userId),
    }));
    toast.success(`Você deixou de seguir ${username || 'este perfil'}`);
  }, []);

  const toggleFollow = useCallback((userId: string, username?: string) => {
    if (relationships.following.includes(userId)) {
      unfollow(userId, username);
      return false;
    } else {
      follow(userId, username);
      return true;
    }
  }, [relationships.following, follow, unfollow]);

  // Block
  const isBlocked = useCallback((userId: string): boolean => {
    return relationships.blocked.includes(userId);
  }, [relationships.blocked]);

  const block = useCallback((userId: string, username?: string) => {
    setRelationships(prev => {
      if (prev.blocked.includes(userId)) return prev;
      return {
        ...prev,
        blocked: [...prev.blocked, userId],
        // Also unfollow when blocking
        following: prev.following.filter(id => id !== userId),
      };
    });
    toast.success(`${username || 'Este perfil'} foi bloqueado`, {
      description: 'Eles não poderão ver seu perfil ou enviar mensagens.',
    });
  }, []);

  const unblock = useCallback((userId: string, username?: string) => {
    setRelationships(prev => ({
      ...prev,
      blocked: prev.blocked.filter(id => id !== userId),
    }));
    toast.success(`${username || 'Este perfil'} foi desbloqueado`);
  }, []);

  const toggleBlock = useCallback((userId: string, username?: string) => {
    if (relationships.blocked.includes(userId)) {
      unblock(userId, username);
      return false;
    } else {
      block(userId, username);
      return true;
    }
  }, [relationships.blocked, block, unblock]);

  // Restrict
  const isRestricted = useCallback((userId: string): boolean => {
    return relationships.restricted.includes(userId);
  }, [relationships.restricted]);

  const restrict = useCallback((userId: string, username?: string) => {
    setRelationships(prev => {
      if (prev.restricted.includes(userId)) return prev;
      return {
        ...prev,
        restricted: [...prev.restricted, userId],
      };
    });
    toast.success(`${username || 'Este perfil'} foi restringido`, {
      description: 'Os comentários deles ficarão visíveis apenas para eles.',
    });
  }, []);

  const unrestrict = useCallback((userId: string, username?: string) => {
    setRelationships(prev => ({
      ...prev,
      restricted: prev.restricted.filter(id => id !== userId),
    }));
    toast.success(`${username || 'Este perfil'} não está mais restringido`);
  }, []);

  const toggleRestrict = useCallback((userId: string, username?: string) => {
    if (relationships.restricted.includes(userId)) {
      unrestrict(userId, username);
      return false;
    } else {
      restrict(userId, username);
      return true;
    }
  }, [relationships.restricted, restrict, unrestrict]);

  // Report
  const hasReported = useCallback((userId: string): boolean => {
    return relationships.reported.includes(userId);
  }, [relationships.reported]);

  const report = useCallback((userId: string, reason: string, username?: string) => {
    setRelationships(prev => {
      if (prev.reported.includes(userId)) return prev;
      return {
        ...prev,
        reported: [...prev.reported, userId],
      };
    });
    toast.success('Denúncia enviada', {
      description: `Obrigado por reportar. Nossa equipe analisará o conteúdo.`,
    });
    
    // Log report (in a real app, this would go to the backend)
    console.log(`Report submitted for user ${userId}: ${reason}`);
  }, []);

  // Get stats
  const getFollowingCount = useCallback((): number => {
    return relationships.following.length;
  }, [relationships.following]);

  const getBlockedCount = useCallback((): number => {
    return relationships.blocked.length;
  }, [relationships.blocked]);

  return {
    relationships,
    // Following
    isFollowing,
    follow,
    unfollow,
    toggleFollow,
    getFollowingCount,
    // Block
    isBlocked,
    block,
    unblock,
    toggleBlock,
    getBlockedCount,
    // Restrict
    isRestricted,
    restrict,
    unrestrict,
    toggleRestrict,
    // Report
    hasReported,
    report,
  };
}
