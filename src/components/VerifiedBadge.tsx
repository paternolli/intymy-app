import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface VerifiedBadgeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

const sizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function VerifiedBadge({ 
  size = 'sm', 
  showTooltip = true,
  className 
}: VerifiedBadgeProps) {
  const badge = (
    <BadgeCheck 
      className={cn(
        sizeClasses[size],
        "text-primary fill-primary/20",
        className
      )} 
    />
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-help">
            {badge}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Perfil verificado</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
