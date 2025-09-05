'use client';

import { motion } from 'framer-motion';
import { Play, Pause, MoreHorizontal, Download } from 'lucide-react';
import Image from 'next/image';
import usePlayerStore, { Track } from '@/lib/stores/player-store';
import { formatTime } from '@/lib/utils';
import LikeButton from '@/components/ui/LikeButton';

interface TrackListProps {
  tracks: Track[];
  showArtwork?: boolean;
  showIndex?: boolean;
  className?: string;
}

const TrackList = ({ 
  tracks, 
  showArtwork = true, 
  showIndex = true,
  className = '' 
}: TrackListProps) => {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    pauseTrack,
    addToQueue,
    isTrackLiked,
  } = usePlayerStore();

  const handleTrackClick = (track: Track, index: number) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        pauseTrack();
      } else {
        playTrack(track, index);
      }
    } else {
      playTrack(track, index);
    }
  };

  const handleAddToQueue = (track: Track, e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(track);
    // TODO: Mostrar toast de confirmación
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {tracks.map((track, index) => {
        const isCurrentTrack = currentTrack?.id === track.id;
        const isCurrentlyPlaying = isCurrentTrack && isPlaying;

        return (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`group flex items-center p-3 sm:p-4 lg:p-4 rounded-lg hover:bg-fondo transition-colors cursor-pointer ${
              isCurrentTrack ? 'bg-fondo border border-stroke' : ''
            }`}
            onClick={() => handleTrackClick(track, index)}
          >
            {/* Índice o botón de play */}
            <div className="w-8 sm:w-10 flex items-center justify-center mr-3 sm:mr-4">
              {isCurrentTrack ? (
                <button className="p-1 sm:p-1.5 flex items-center justify-center" style={{ minHeight: '44px', minWidth: '44px' }}>
                  {isCurrentlyPlaying ? (
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  ) : (
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  )}
                </button>
              ) : (
                <span className="text-grey text-sm sm:text-base group-hover:hidden">
                  {showIndex ? index + 1 : ''}
                </span>
              )}
              
              {!isCurrentTrack && (
                <button className="p-1 sm:p-1.5 hidden group-hover:block flex items-center justify-center" style={{ minHeight: '44px', minWidth: '44px' }}>
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              )}
            </div>

            {/* Artwork */}
            {showArtwork && (
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-md overflow-hidden mr-3 sm:mr-4 flex-shrink-0">
                <Image
                  src={track.thumbnail}
                  alt={track.title}
                  fill // Use fill to make the image cover the parent div
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Add appropriate sizes
                  className="object-cover"
                />
                {isCurrentlyPlaying && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            )}

            {/* Info del track */}
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium truncate text-sm sm:text-base lg:text-lg ${
                isCurrentTrack ? 'text-primary' : 'text-white'
              }`}>
                {track.title}
              </h3>
              <p className="text-grey text-xs sm:text-sm lg:text-base truncate">
                {track.artist || 'YOUNGMUFF'} • {track.genre}
              </p>
            </div>

            {/* Duración */}
            <div className="text-grey text-xs sm:text-sm lg:text-base font-mono mr-2 sm:mr-3 hidden sm:block">
              {formatTime(track.duration)}
            </div>

            {/* Acciones */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Favorito con animación de partículas - siempre visible si está liked */}
              <div className={`${isTrackLiked(track.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100'} transition-opacity`}>
                <LikeButton 
                  trackId={track.id}
                  size="sm"
                  showParticles={true}
                  className="flex items-center justify-center"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                />
              </div>

              {/* Otras acciones - visibles en hover en desktop, siempre visibles en mobile */}
              <div className="flex items-center space-x-1 sm:space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                {/* Descargar */}
                {track.downloadable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Descargar track
                    }}
                    className="p-1.5 sm:p-2 text-grey hover:text-white transition-colors flex items-center justify-center"
                    style={{ minHeight: '44px', minWidth: '44px' }}
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}

                {/* Más opciones */}
                <button
                  onClick={(e) => handleAddToQueue(track, e)}
                  className="p-1.5 sm:p-2 text-grey hover:text-white transition-colors flex items-center justify-center"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TrackList;