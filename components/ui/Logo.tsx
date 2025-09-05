'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'full' | 'icon';
  href?: string;
  className?: string;
  priority?: boolean;
}

const Logo = ({ 
  size = 'md', 
  variant = 'default', 
  href = '/', 
  className = '',
  priority = false 
}: LogoProps) => {
  const sizeConfig = {
    sm: { width: 80, height: 26 },
    md: { width: 120, height: 40 },
    lg: { width: 160, height: 53 },
    xl: { width: 200, height: 66 }
  };

  const logoSrc = {
    default: '/images/logo.png',
    full: '/images/logo-full.png',
    icon: '/favicon.png'
  };

  const { width, height } = sizeConfig[size];
  const src = logoSrc[variant];

  const logoElement = (
    <Image
      src={src}
      alt="YOUNGMUFF"
      width={width}
      height={height}
      className={`h-auto w-auto max-h-full object-contain ${className}`}
      priority={priority}
    />
  );

  if (href) {
    return (
      <Link href={href} className="flex-shrink-0 inline-block">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
};

export default Logo;