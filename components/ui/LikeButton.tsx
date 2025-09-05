'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import ParticleAnimation from './ParticleAnimation';
import usePlayerStore from '@/lib/stores/player-store';

interface LikeButtonProps {
  trackId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showParticles?: boolean;
  style?: React.CSSProperties;
}

const LikeButton = ({ 
  trackId, 
  className = '', 
  size = 'md',
  showParticles = true 
}: LikeButtonProps) => {
  const { toggleLike, isTrackLiked } = usePlayerStore();
  const [showAnimation, setShowAnimation] = useState(false);
  const isLiked = isTrackLiked(trackId);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const wasLiked = isLiked;
    toggleLike(trackId);
    
    // Solo mostrar animación cuando se da "me gusta" (no cuando se quita)
    if (!wasLiked && showParticles) {
      setShowAnimation(true);
    }
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleLike}
        className={`relative p-2 text-grey hover:text-white transition-colors ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart 
          className={`${sizeClasses[size]} transition-colors duration-200 ${
            isLiked 
              ? 'text-red-500 fill-red-500' 
              : 'text-grey hover:text-white'
          }`}
        />
        
        {/* Efecto de pulso cuando se da like */}
        {isLiked && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-500"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        )}
      </motion.button>

      {/* Animación de partículas */}
      {showParticles && (
        <ParticleAnimation
          isActive={showAnimation}
          onComplete={handleAnimationComplete}
          particleCount={12}
          duration={1.8}
          logoSrc="/images/logo-md.png"
        />
      )}
    </div>
  );
};

export default LikeButton;