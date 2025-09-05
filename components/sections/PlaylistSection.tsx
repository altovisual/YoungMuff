'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import TrackList from '@/components/Player/TrackList';
// import Logo from '@/components/ui/Logo'; // Logo removido
import usePlayerStore, { Track } from '@/lib/stores/player-store';
import './playlist.css';

interface PlaylistSectionProps {
  tracks: Track[];
}

const PlaylistSection = ({ tracks }: PlaylistSectionProps) => {
  const { setTracks, currentTrack } = usePlayerStore();

  useEffect(() => {
    if (tracks.length > 0) {
      setTracks(tracks);
    }
  }, [tracks, setTracks]);

  return (
    <section className="py-16 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Lista de tracks */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Image
                  src="/images/Capa-14.png"
                  alt="Playlist"
                  width={96}
                  height={96}
                  className="rounded-lg"
                />
                {/* Mini logo overlay removido */}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  PlayList
                </h1>
                <p className="text-grey">
                  {tracks.length} tracks
                </p>
              </div>
            </div>

            <TrackList tracks={tracks} />
          </div>

          {/* Artwork actual */}
          <div className="lg:sticky lg:top-8">
            <motion.div
              key={currentTrack?.id || 'default'}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="video-section aspect-square relative rounded-2xl overflow-hidden bg-fondo"
            >
              {currentTrack ? (
                <Image
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="relative h-full">
                  {/* Imagen de fondo */}
                  <div 
                    className="video-background"
                    style={{
                      backgroundImage: 'url(/images/hero-bg.jpg)',
                    }}
                  />
                  
                  {/* Degradado overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
                  
                  {/* Contenido */}
                  <div className="relative h-full flex flex-col items-center justify-center space-y-8 p-8">
                    {/* Logo principal arriba */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-center"
                    >
                      {/* Logo removido */}
                    </motion.div>
                    
                    {/* GIF animado en el centro */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="gif-container relative"
                    >
                      <Image
                        src="/images/FREEMAIKOL-FINAL.gif"
                        alt="FREEMAIKY"
                        width={180}
                        height={180}
                        className="opacity-90 rounded-xl shadow-2xl relative z-10"
                        unoptimized // GIFs are not optimized by Next.js Image component
                      />
                    </motion.div>
                    
                    {/* Logo secundario más abajo */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="text-center space-y-3"
                    >
                      {/* Logo removido */}
                      
                      {/* Texto FREEMAIKY con estilo */}
                      <div>
                        <h3 className="freemaiky-title text-3xl font-bold mb-2 tracking-wider">
                          #FREEMAIKY
                        </h3>
                        <p className="text-grey text-sm uppercase tracking-wide">
                          Video Oficial
                        </p>
                        <div className="decorative-line w-16 h-0.5 mx-auto mt-2" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
              
              {/* Overlay con info del track */}
              {currentTrack && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {currentTrack.title}
                  </h2>
                  <p className="text-grey">
                    {currentTrack.artist} • {currentTrack.genre}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaylistSection;