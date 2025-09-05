'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PaintBackground from '@/components/ui/PaintBackground';
import Logo from '@/components/ui/Logo';
import './hero.css';

const Hero = () => {
  return (
    <section className="hero-section relative py-12 md:py-20 px-4 overflow-hidden min-h-[80vh] md:min-h-[90vh]">
      {/* Imagen de fondo con parallax */}
      <div 
        className="hero-bg"
        style={{
          backgroundImage: 'url(/images/hero-bg.jpg)',
        }}
      />
      
      {/* Degradado overlay múltiple para mejor legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/95 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60 pointer-events-none" />
      
      {/* Animación de fondo estilo pintura */}
      <PaintBackground />
      
      <div className="relative max-w-4xl mx-auto text-center z-10 h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 md:space-y-8 w-full"
        >
          {/* Logo principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <Logo size="lg" variant="full" href="" className="hero-logo max-w-48 md:max-w-xs lg:max-w-sm" />
          </motion.div>

          <h2 className="hero-title text-3xl md:text-5xl font-bold text-white">
            Más que música,{' '}
            <span className="text-primary">una experiencia</span>
          </h2>
          
          <p className="hero-subtitle text-lg text-grey max-w-2xl mx-auto">
            Descubre la colección completa de música. Desde los últimos tracks 
            hasta merchandise exclusivo que refleja nuestro estilo único.
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xs mx-auto sm:max-w-none">
            <Link href="/merchandise" className="btn-primary w-full sm:w-auto">
              Ver Merchandise
            </Link>
            <a
              href="https://open.spotify.com/intl-es/artist/3CYn5NgjKp6OG72lmtbiqL"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full sm:w-auto"
            >
              Seguir en Spotify
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-stroke">
            <div>
              <div className="text-2xl font-bold text-primary">8+</div>
              <div className="text-sm text-grey">Tracks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">10K+</div>
              <div className="text-sm text-grey">Reproducciones</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">100+</div>
              <div className="text-sm text-grey">Fans</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;