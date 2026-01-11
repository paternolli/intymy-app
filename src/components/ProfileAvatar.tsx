import { ProfileType, ProfileMember } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ProfileAvatarProps {
  profileType: ProfileType;
  members: ProfileMember[];
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showRing?: boolean;
  className?: string;
}

const sizeClasses = {
  xs: 'h-6 w-6',
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
};

function MosaicImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="h-full w-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
        {alt.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      loading="lazy"
    />
  );
}

export function ProfileAvatar({
  profileType,
  members,
  size = 'md',
  showRing = false,
  className,
}: ProfileAvatarProps) {
  const ringClass = showRing ? 'ring-2 ring-primary' : '';

  // Single
  if (profileType === 'single' && members.length === 1) {
    return (
      <Avatar className={cn(sizeClasses[size], ringClass, className)}>
        <AvatarImage src={members[0].avatar} alt={members[0].name} className="object-cover" />
        <AvatarFallback className="bg-muted text-muted-foreground font-medium">
          {members[0].name.charAt(0)}
        </AvatarFallback>
      </Avatar>
    );
  }

  // Couple or Dating (2-way mosaic inside a single circle)
  if ((profileType === 'couple' || profileType === 'dating') && members.length >= 2) {
    return (
      <div
        className={cn(
          sizeClasses[size],
          ringClass,
          'rounded-full overflow-hidden bg-background',
          className
        )}
        aria-label={`${members[0].name} e ${members[1].name}`}
      >
        <div className="grid h-full w-full grid-cols-2 gap-px bg-background">
          <MosaicImage src={members[0]?.avatar} alt={members[0]?.name ?? '?'} />
          <MosaicImage src={members[1]?.avatar} alt={members[1]?.name ?? '?'} />
        </div>
      </div>
    );
  }

  // Throuple (3-way mosaic)
  if (profileType === 'throuple' && members.length >= 3) {
    return (
      <div
        className={cn(
          sizeClasses[size],
          ringClass,
          'rounded-full overflow-hidden bg-background',
          className
        )}
        aria-label={`${members[0].name}, ${members[1].name} e ${members[2].name}`}
      >
        <div className="grid h-full w-full grid-rows-2 gap-px bg-background">
          <MosaicImage src={members[0]?.avatar} alt={members[0]?.name ?? '?'} />
          <div className="grid grid-cols-2 gap-px bg-background">
            <MosaicImage src={members[1]?.avatar} alt={members[1]?.name ?? '?'} />
            <MosaicImage src={members[2]?.avatar} alt={members[2]?.name ?? '?'} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Avatar className={cn(sizeClasses[size], ringClass, className)}>
      <AvatarFallback className="bg-muted text-muted-foreground">?</AvatarFallback>
    </Avatar>
  );
}

interface ProfileNamesProps {
  members: ProfileMember[];
  className?: string;
}

export function ProfileNames({ members, className }: ProfileNamesProps) {
  if (members.length === 1) return <span className={className}>{members[0].name}</span>;
  if (members.length === 2) return <span className={className}>{members[0].name} & {members[1].name}</span>;
  if (members.length >= 3) return <span className={className}>{members[0].name}, {members[1].name} & {members[2].name}</span>;
  return null;
}
