import { Ubuntu } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

const font = Ubuntu({
  weight: ['700'],
  subsets: ['latin'],
});

interface LogoProps {
  white?: boolean;
}

export const Logo = ({ white }: LogoProps) => {
  return (
    <Link href="/" className="flex items-center gap-x-1.5">
      <Image src="/hitbullseye_logo.png" alt="Icon" height={40} width={40} unoptimized />
      <p className={cn('text-2xl font-bold', white ? 'text-white' : 'text-[#111]', font.className)}>Evolvian</p>
    </Link>
  );
};

