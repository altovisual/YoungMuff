'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  onChange: (value: number[]) => void;
  className?: string;
}

const ProgressBar = ({ value, onChange, className }: ProgressBarProps) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    onChange([Math.max(0, Math.min(100, percent))]);
  };

  return (
    <div
      className={cn(
        'relative w-full bg-stroke hover:bg-stroke/80 cursor-pointer transition-colors',
        className
      )}
      onClick={handleClick}
    >
      <div
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
      
      {/* Hover indicator */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
        <div className="h-full bg-primary/20" />
      </div>
    </div>
  );
};

export default ProgressBar;