import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 sm:h-8',
    md: 'h-8 sm:h-10',
    lg: 'h-12 sm:h-16',
    xl: 'h-16 sm:h-20',
    '2xl': 'h-28 sm:h-36',
  };

  return (
    <Image
      src="/Reset2026Logo.png"
      alt="RESET 2026 Logo"
      width={986}
      height={302}
      className={`${sizeClasses[size]} w-auto ${className}`}
      priority
      unoptimized
    />
  );
}
