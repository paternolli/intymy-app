import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'unlocked_products';

export const useUnlockedProducts = () => {
  const [unlockedProducts, setUnlockedProducts] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedProducts));
  }, [unlockedProducts]);

  const isUnlocked = useCallback((productId: string) => {
    return unlockedProducts.includes(productId);
  }, [unlockedProducts]);

  const unlockProduct = useCallback((productId: string) => {
    setUnlockedProducts(prev => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });
  }, []);

  const lockProduct = useCallback((productId: string) => {
    setUnlockedProducts(prev => prev.filter(id => id !== productId));
  }, []);

  return {
    unlockedProducts,
    isUnlocked,
    unlockProduct,
    lockProduct,
  };
};
