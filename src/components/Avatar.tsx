import React, { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { User as UserIcon } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
}

export default function Avatar({ src, alt, className = '' }: AvatarProps) {
  const { theme } = useThemeStore();
  const [currentSrc, setCurrentSrc] = useState<string | null>(src ?? null);
  const [errored, setErrored] = useState<boolean>(!src);

  useEffect(() => {
    setCurrentSrc(src ?? null);
    setErrored(!src);
  }, [src]);

  // If image errors, show inline icon instead of relying on external files
  const handleError = () => setErrored(true);

  // If we have a valid src and it hasn't errored, render <img>
  if (currentSrc && !errored) {
    return (
      <img
        src={currentSrc}
        alt={alt ?? 'avatar'}
        className={className}
        onError={handleError}
      />
    );
  }

  // Fallback: inline user icon styled to match the passed sizing classes
  // We wrap the icon in a div so rounded/full background classes apply.
  return (
    <div className={`${className} bg-muted flex items-center justify-center text-sm text-foreground`}>
      <UserIcon className="w-4 h-4" />
    </div>
  );
}

