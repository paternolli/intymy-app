import { useEffect, useState } from 'react';
import { AnimatedLogo } from './AnimatedLogo';
import { cn } from '@/lib/utils';

interface SplashScreenProps {
  duration?: number;
  onComplete?: () => void;
}

export function SplashScreen({ duration = 2500, onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, duration - 500);

    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 transition-opacity duration-500',
      isFading && 'opacity-0'
    )}>
      <div className="relative">
        {/* Glow effect behind logo */}
        <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full scale-150" />
        
        <AnimatedLogo variant="splash" />
      </div>
      
      <p className="mt-8 text-sm text-muted-foreground">
        Rede social para todos os tipos de amor
      </p>
      
      {/* Animated dots */}
      <div className="mt-6 flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-primary animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
