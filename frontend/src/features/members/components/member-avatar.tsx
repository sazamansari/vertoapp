import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MemberAvatarProps {
  name: string;
  role?: string;
  imageUrl?: string;
  className?: string;
  fallbackClassName?: string;
}

export const MemberAvatar = ({ name, role, imageUrl, className, fallbackClassName }: MemberAvatarProps) => {
  // Generate a distinct premium styled avatar based on name and role for a rich visual directory
  const seed = `${name}-${role || 'MEMBER'}`;
  const style = role === 'ADMIN' ? 'adventurer' : 'lorelei';
  const avatarUrl = imageUrl || `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;

  return (
    <Avatar className={cn('size-5 rounded-full border border-neutral-300 transition hover:scale-105', className)}>
      <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
      <AvatarFallback className={cn('flex items-center justify-center bg-neutral-200 font-medium text-neutral-500', fallbackClassName)}>
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
