import { Rocket, Crown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

type BoostLevel = 'quick' | 'standard' | 'premium';

interface BoostedBadgeProps {
  level?: BoostLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const levelConfig = {
  quick: {
    icon: Zap,
    label: 'Em Alta',
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/50',
  },
  standard: {
    icon: Rocket,
    label: 'Destaque',
    gradient: 'from-primary to-accent',
    glow: 'shadow-primary/50',
  },
  premium: {
    icon: Crown,
    label: 'Super Destaque',
    gradient: 'from-yellow-500 to-orange-500',
    glow: 'shadow-yellow-500/50',
  },
};

const sizeConfig = {
  sm: {
    container: 'h-5 px-1.5 gap-1 text-[10px]',
    icon: 'h-3 w-3',
  },
  md: {
    container: 'h-6 px-2 gap-1.5 text-xs',
    icon: 'h-3.5 w-3.5',
  },
  lg: {
    container: 'h-8 px-3 gap-2 text-sm',
    icon: 'h-4 w-4',
  },
};

export function BoostedBadge({ 
  level = 'standard', 
  size = 'md', 
  showLabel = true,
  className 
}: BoostedBadgeProps) {
  const config = levelConfig[level];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-gradient-to-r text-white font-medium shadow-lg animate-pulse",
        config.gradient,
        config.glow,
        sizeStyles.container,
        className
      )}
    >
      <Icon className={cn(sizeStyles.icon, "animate-bounce")} style={{ animationDuration: '2s' }} />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}

// Glow effect for profile cards/avatars
export function BoostedGlow({ 
  level = 'standard',
  children,
  className 
}: { 
  level?: BoostLevel;
  children: React.ReactNode;
  className?: string;
}) {
  const glowColors = {
    quick: 'ring-blue-500/50 shadow-blue-500/30',
    standard: 'ring-primary/50 shadow-primary/30',
    premium: 'ring-yellow-500/50 shadow-yellow-500/30',
  };

  return (
    <div className={cn(
      "relative ring-2 ring-offset-2 ring-offset-background shadow-lg",
      glowColors[level],
      className
    )}>
      {children}
      {/* Animated glow effect */}
      <div className={cn(
        "absolute inset-0 rounded-full animate-ping opacity-30 bg-gradient-to-r",
        level === 'quick' && "from-blue-500 to-cyan-500",
        level === 'standard' && "from-primary to-accent",
        level === 'premium' && "from-yellow-500 to-orange-500"
      )} style={{ animationDuration: '3s' }} />
    </div>
  );
}