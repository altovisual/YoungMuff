'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const VideoSection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-fondo/20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <Image
              src="/images/Recurso-5saint.png"
              alt="FREEMAIKY"
              width={150}
              height={150}
              className="rounded-lg"
            />
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            #FREEMAIKY
          </h1>
          <h2 className="text-xl md:text-2xl text-grey mb-2">
            (Video Oficial)
          </h2>
          <div className="text-sm text-primary font-mono">
            BETA RELEASE 0.8
          </div>

          {/* Video Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mt-8"
          >
            {/* Wistia Player */}
            <div className="absolute inset-0">
              <iframe
                src="https://fast.wistia.net/embed/iframe/zjk6ev78x3?videoFoam=true"
                title="#FREEMAIKY (Video Oficial)"
                allow="autoplay; fullscreen"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </motion.div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-8"
          >
            <p className="text-grey mb-6">
              Escucha el track completo en la playlist de abajo
            </p>
            <button
              onClick={() => {
                document.getElementById('playlist')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
              className="btn-primary"
            >
              Escuchar Ahora
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;