'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Download
} from 'lucide-react';
import Image from 'next/image';
import usePlayerStore from '@/lib/stores/player-store';
import { formatTime } from '@/lib/utils';
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';

const AudioPlayer = () => {
  // Inicializar hook de conectividad
  useOnlineStatus();

  const {
    currentTrack,
    isPlaying,
    isLoading,
    volume,
    currentTime,
    duration,
    isShuffled,
    repeatMode,
    howl,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    setCurrentTime,
    seekTo,
  } = usePlayerStore();

  const progressInterval = useRef<NodeJS.Timeout>();

  // Actualizar tiempo actual
  useEffect(() => {
    if (isPlaying && howl) {
      progressInterval.current = setInterval(() => {
        const seek = howl.seek();
        if (typeof seek === 'number') {
          setCurrentTime(seek);
        }
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, howl, setCurrentTime]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  if (!currentTrack) {
    return null;
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    seekTo(newTime);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-stroke"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Barra de progreso superior */}
        <div className="absolute top-0 left-0 right-0">
          <ProgressBar
            value={(currentTime / duration) * 100 || 0}
            onChange={handleProgressChange}
            className="h-1"
          />
        </div>

        <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="grid grid-cols-3 items-center max-w-screen-xl mx-auto">
            {/* Info del track */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 40px, 48px"
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="min-w-0 flex-1 md:hidden">
                <h3 className="text-white font-medium truncate text-xs sm:text-sm">
                  {currentTrack.title}
                </h3>
                <p className="text-grey text-xs truncate">
                  {currentTrack.artist || 'YOUNGMUFF'}
                </p>
              </div>
            </div>

            {/* Controles principales */}
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              {/* Shuffle (desktop) */}
              <button
                onClick={toggleShuffle}
                className={`p-1.5 sm:p-2 rounded-full transition-colors hidden md:block flex items-center justify-center ${
                  isShuffled 
                    ? 'text-primary bg-primary/20' 
                    : 'text-grey hover:text-white'
                }`}
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              {/* Anterior */}
              <button
                onClick={previousTrack}
                className="p-1.5 sm:p-2 text-grey hover:text-white transition-colors flex items-center justify-center"
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                disabled={isLoading}
                className="p-2 sm:p-3 bg-primary hover:bg-primary/80 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center"
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                {isLoading ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" />
                )}
              </button>

              {/* Siguiente */}
              <button
                onClick={nextTrack}
                className="p-1.5 sm:p-2 text-grey hover:text-white transition-colors flex items-center justify-center"
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Repeat (desktop) */}
              <button
                onClick={toggleRepeat}
                className={`p-1.5 sm:p-2 rounded-full transition-colors hidden md:block flex items-center justify-center ${
                  repeatMode !== 'none'
                    ? 'text-primary bg-primary/20'
                    : 'text-grey hover:text-white'
                }`}
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className="w-4 h-4" />
                ) : (
                  <Repeat className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Controles adicionales */}
            <div className="flex items-center justify-end">
              <div className="hidden md:flex items-center space-x-2 lg:space-x-3 flex-1 justify-end">
                {/* Tiempo (desktop) */}
                <div className="hidden md:block text-xs lg:text-sm text-grey font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                {/* Favorito (desktop) */}
                <button 
                  className="hidden md:flex p-1.5 lg:p-2 text-grey hover:text-white transition-colors items-center justify-center"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <Heart className="w-4 h-4" />
                </button>

                {/* Descargar (desktop) */}
                {currentTrack.downloadable && (
                  <button 
                    className="hidden md:flex p-1.5 lg:p-2 text-grey hover:text-white transition-colors items-center justify-center"
                    style={{ minHeight: '44px', minWidth: '44px' }}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Control de volumen */}
              <div className="flex items-center">
                <VolumeControl
                  volume={volume}
                  onVolumeChange={setVolume}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AudioPlayer;