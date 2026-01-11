import { AnimatedLogo } from './AnimatedLogo';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

export function LoadingScreen({ message = 'Carregando...', className }: LoadingScreenProps) {
  return (
    <div className={cn(
      'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background',
      className
    )}>
      <AnimatedLogo variant="loading" />
      <p className="mt-4 text-sm text-muted-foreground animate-pulse">
        {message}
      </p>
    </div>
  );
}
