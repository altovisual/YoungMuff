'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
}

const VolumeControl = ({ volume, onVolumeChange, className }: VolumeControlProps) => {
  const [showSlider, setShowSlider] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMute = () => {
    if (volume > 0) {
      setPreviousVolume(volume);
      onVolumeChange(0);
    } else {
      onVolumeChange(previousVolume || 0.8);
    }
  };

  const handleSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(1, percent));
    onVolumeChange(newVolume);
  };

  const toggleSlider = () => {
    handleMute();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSlider(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn('flex items-center space-x-2', className)}>
      <button
        onClick={toggleSlider}
        className="p-2 text-grey hover:text-white transition-colors"
      >
        {volume === 0 ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>

      <div 
        className={cn(
          'relative w-20 h-1 bg-stroke rounded-full cursor-pointer transition-all duration-200',
          showSlider ? 'opacity-100' : 'opacity-0 w-0'
        )}
        onClick={handleSliderChange}
      >
        <div
          className="h-full bg-primary rounded-full transition-all duration-150"
          style={{ width: `${volume * 100}%` }}
        />
        
        <div
          className="absolute top-1/2 w-3 h-3 bg-primary rounded-full transform -translate-y-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity"
          style={{ left: `${volume * 100}%` }}
        />
      </div>
    </div>
  );
};

export default VolumeControl;