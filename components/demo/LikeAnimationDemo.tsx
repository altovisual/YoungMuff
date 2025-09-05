'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import LikeButton from '@/components/ui/LikeButton';
import ParticleAnimation from '@/components/ui/ParticleAnimation';

const LikeAnimationDemo = () => {
  const [showDemo, setShowDemo] = useState(false);

  const handleDemoClick = () => {
    setShowDemo(true);
  };

  const handleDemoComplete = () => {
    setShowDemo(false);
  };

  return (
    <div className="bg-fondo rounded-lg p-8 text-center">
      <h3 className="text-xl font-bold text-white mb-4">
        ¡Prueba la animación de &quot;Me Gusta&quot;!
      </h3>
      
      <p className="text-grey mb-6">
        Haz clic en el corazón para ver las partículas del logo de Maiki
      </p>

      <div className="flex items-center justify-center space-x-6">
        {/* Botón de demo independiente */}
        <div className="relative">
          <motion.button
            onClick={handleDemoClick}
            className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Probar Animación
          </motion.button>
          
          <ParticleAnimation
            isActive={showDemo}
            onComplete={handleDemoComplete}
            particleCount={15}
            duration={2}
            logoSrc="/images/logo-md.png"
          />
        </div>

        {/* Ejemplo con LikeButton real */}
        <div className="flex flex-col items-center">
          <p className="text-grey text-sm mb-2">O usa el botón real:</p>
          <LikeButton 
            trackId="demo-track"
            size="lg"
            showParticles={true}
            className="bg-fondo/50 rounded-full"
          />
        </div>
      </div>

      <div className="mt-6 text-sm text-grey/70">
        <p>Las partículas usan el logo oficial de Maiki y aparecen cada vez que das &quot;me gusta&quot; a una canción</p>
      </div>
    </div>
  );
};

export default LikeAnimationDemo;