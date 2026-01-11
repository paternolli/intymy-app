import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

interface AnimatedLogoProps {
  variant?: 'header' | 'splash' | 'loading';
  className?: string;
  showText?: boolean;
}

export function AnimatedLogo({ variant = 'header', className, showText = true }: AnimatedLogoProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(variant === 'loading');

  // Only use navigate for header variant (inside Router context)
  const navigate = variant === 'header' ? useNavigate() : null;

  useEffect(() => {
    if (variant !== 'header') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant]);

  useEffect(() => {
    if (variant === 'loading') {
      const interval = setInterval(() => {
        setIsLoading(prev => !prev);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [variant]);

  const sizes = {
    header: 'h-8 w-8',
    splash: 'h-24 w-24',
    loading: 'h-16 w-16',
  };

  const textSizes = {
    header: 'text-xl',
    splash: 'text-4xl',
    loading: 'text-2xl',
  };

  const logoElement = (
    <img 
      src={logo} 
      alt="íNtymy" 
      className={cn(
        sizes[variant],
        'object-contain transition-all duration-300',
        variant === 'header' && isScrolled && 'scale-90',
        variant === 'loading' && 'animate-pulse',
        variant === 'splash' && 'animate-[bounce_2s_ease-in-out_infinite]'
      )} 
    />
  );

  const content = (
    <div className={cn(
      'flex items-center gap-2',
      variant === 'splash' && 'flex-col gap-4',
      variant === 'loading' && 'flex-col gap-3',
      className
    )}>
      {logoElement}
      {showText && (
        <span className={cn(
          'font-semibold tracking-tight text-brand-gradient transition-all duration-300',
          textSizes[variant],
          variant === 'header' && isScrolled && 'scale-95'
        )}>
          íNtymy
        </span>
      )}
    </div>
  );

  if (variant === 'header' && navigate) {
    return (
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        {content}
      </button>
    );
  }

  return content;
}
