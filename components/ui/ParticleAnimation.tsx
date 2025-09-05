'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  delay: number;
}

interface ParticleAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
  particleCount?: number;
  duration?: number;
  logoSrc?: string;
}

const ParticleAnimation = ({
  isActive,
  onComplete,
  particleCount = 15,
  duration = 2,
  logoSrc = '/images/logo-md.png'
}: ParticleAnimationProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isActive) {
      // Generar partículas en patrones más interesantes
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => {
        const angle = (i / particleCount) * Math.PI * 2; // Distribución circular
        const radius = 60 + Math.random() * 40; // Radio variable más pequeño para móvil
        const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 40;
        const y = Math.sin(angle) * radius + (Math.random() - 0.5) * 40;
        
        return {
          id: i,
          x,
          y,
          rotation: Math.random() * 360,
          scale: 0.4 + Math.random() * 0.6, // 0.4 a 1.0
          delay: Math.random() * 0.4, // 0 a 0.4s de delay
        };
      });
      
      setParticles(newParticles);

      // Limpiar partículas después de la animación
      const timeout = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, (duration + 0.6) * 1000);

      return () => clearTimeout(timeout);
    }
  }, [isActive, particleCount, duration, onComplete]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden scale-75 sm:scale-90 lg:scale-100">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute top-1/2 left-1/2 w-6 h-6 sm:w-8 sm:h-8"
            initial={{
              x: -12, // Centrar la imagen (mitad del ancho para móvil)
              y: -12, // Centrar la imagen (mitad del alto para móvil)
              scale: 0,
              rotate: 0,
              opacity: 0,
            }}
            animate={{
              x: particle.x - 12,
              y: particle.y - 12,
              scale: [0, particle.scale * 1.2, particle.scale, 0],
              rotate: [0, particle.rotation, particle.rotation + 360],
              opacity: [0, 1, 0.8, 0],
            }}
            transition={{
              duration: duration,
              delay: particle.delay,
              ease: [0.25, 0.46, 0.45, 0.94], // Ease out cubic
              times: [0, 0.3, 0.7, 1], // Keyframes para la animación
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
          >
            <Image
              src={logoSrc}
              alt="Maiki Logo"
              width={24}
              height={24}
              className="w-full h-full object-contain filter drop-shadow-lg brightness-110"
              draggable={false}
              sizes="(max-width: 640px) 24px, 32px"
            />
            
            {/* Efecto de brillo adicional */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent rounded-full blur-sm"
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: duration * 0.6,
                delay: particle.delay + 0.1,
                ease: 'easeOut',
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ParticleAnimation;