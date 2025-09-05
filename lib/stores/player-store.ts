import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Howl } from 'howler';

export interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  r2Url?: string;
  duration: string;
  genre: string;
  thumbnail: string;
  downloadable?: boolean;
  isLiked?: boolean;
}

interface PlayerState {
  // Estado del reproductor
  currentTrack: Track | null;
  currentIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  
  // Lista de reproducción
  tracks: Track[];
  queue: Track[];
  history: Track[];
  likedTracks: string[]; // IDs de tracks que le gustan al usuario
  
  // Audio instance
  howl: Howl | null;
  
  // Estado de conectividad
  isOnline: boolean;
  offlineMode: boolean;
  
  // Acciones
  setTracks: (tracks: Track[]) => void;
  playTrack: (track: Track, index?: number) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  toggleLike: (trackId: string) => void;
  isTrackLiked: (trackId: string) => boolean;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsLoading: (loading: boolean) => void;
  setOnlineStatus: (online: boolean) => void;
  cleanup: () => void;
}

const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      currentTrack: null,
      currentIndex: 0,
      isPlaying: false,
      isLoading: false,
      volume: 0.8,
      currentTime: 0,
      duration: 0,
      isShuffled: false,
      repeatMode: 'none',
      tracks: [],
      queue: [],
      history: [],
      likedTracks: [],
      howl: null,
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      offlineMode: false,

      // Acciones
      setTracks: (tracks) => set({ tracks }),

      playTrack: (track, index) => {
        const state = get();
        
        // Limpiar audio anterior
        if (state.howl) {
          state.howl.unload();
        }

        // Determinar URL de audio
        const audioUrl = state.isOnline && track.r2Url 
          ? `${process.env.NEXT_PUBLIC_R2_URL}/${track.r2Url}`
          : track.audioUrl;

        // Crear nueva instancia de Howl
        const howl = new Howl({
          src: [audioUrl],
          html5: true,
          preload: true,
          onload: () => {
            set({ 
              isLoading: false, 
              duration: howl.duration() 
            });
          },
          onplay: () => {
            set({ isPlaying: true });
          },
          onpause: () => {
            set({ isPlaying: false });
          },
          onend: () => {
            const currentState = get();
            if (currentState.repeatMode === 'one') {
              howl.seek(0);
              howl.play();
            } else {
              currentState.nextTrack();
            }
          },
          onloaderror: (_, error) => {
            console.error('Error cargando audio:', error);
            set({ isLoading: false });
          },
          onplayerror: (_, error) => {
            console.error('Error reproduciendo audio:', error);
            set({ isPlaying: false });
          },
        });

        set({
          currentTrack: track,
          currentIndex: index ?? state.currentIndex,
          howl,
          isLoading: true,
          currentTime: 0,
        });

        // Agregar a historial
        const newHistory = [track, ...state.history.filter(t => t.id !== track.id)].slice(0, 50);
        set({ history: newHistory });

        howl.play();
      },

      pauseTrack: () => {
        const { howl } = get();
        if (howl) {
          howl.pause();
        }
      },

      resumeTrack: () => {
        const { howl } = get();
        if (howl) {
          howl.play();
        }
      },

      nextTrack: () => {
        const state = get();
        const { tracks, queue, currentIndex, isShuffled, repeatMode } = state;
        
        let nextTrack: Track | null = null;
        let nextIndex = currentIndex;

        // Prioridad: cola de reproducción
        if (queue.length > 0) {
          nextTrack = queue[0];
          set({ queue: queue.slice(1) });
        } else if (tracks.length > 0) {
          if (isShuffled) {
            // Modo aleatorio
            const availableIndexes = tracks
              .map((_, i) => i)
              .filter(i => i !== currentIndex);
            nextIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
          } else {
            // Modo secuencial
            nextIndex = currentIndex + 1;
            if (nextIndex >= tracks.length) {
              if (repeatMode === 'all') {
                nextIndex = 0;
              } else {
                return; // No hay más tracks
              }
            }
          }
          nextTrack = tracks[nextIndex];
        }

        if (nextTrack) {
          state.playTrack(nextTrack, nextIndex);
        }
      },

      previousTrack: () => {
        const state = get();
        const { tracks, currentIndex, history } = state;

        // Si hay historial, usar el track anterior del historial
        if (history.length > 1) {
          const previousTrack = history[1];
          const trackIndex = tracks.findIndex(t => t.id === previousTrack.id);
          state.playTrack(previousTrack, trackIndex);
          return;
        }

        // Si no hay historial, ir al track anterior en la lista
        if (tracks.length > 0) {
          const prevIndex = currentIndex - 1;
          if (prevIndex >= 0) {
            state.playTrack(tracks[prevIndex], prevIndex);
          } else if (state.repeatMode === 'all') {
            state.playTrack(tracks[tracks.length - 1], tracks.length - 1);
          }
        }
      },

      seekTo: (time) => {
        const { howl } = get();
        if (howl) {
          howl.seek(time);
          set({ currentTime: time });
        }
      },

      setVolume: (volume) => {
        const { howl } = get();
        if (howl) {
          howl.volume(volume);
        }
        set({ volume });
      },

      toggleShuffle: () => {
        set((state) => ({ isShuffled: !state.isShuffled }));
      },

      toggleRepeat: () => {
        set((state) => ({
          repeatMode: 
            state.repeatMode === 'none' ? 'all' :
            state.repeatMode === 'all' ? 'one' : 'none'
        }));
      },

      addToQueue: (track) => {
        set((state) => ({
          queue: [...state.queue, track]
        }));
      },

      removeFromQueue: (index) => {
        set((state) => ({
          queue: state.queue.filter((_, i) => i !== index)
        }));
      },

      clearQueue: () => {
        set({ queue: [] });
      },

      toggleLike: (trackId) => {
        set((state) => {
          const isLiked = state.likedTracks.includes(trackId);
          const newLikedTracks = isLiked
            ? state.likedTracks.filter(id => id !== trackId)
            : [...state.likedTracks, trackId];
          
          return { likedTracks: newLikedTracks };
        });
      },

      isTrackLiked: (trackId) => {
        return get().likedTracks.includes(trackId);
      },

      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      setOnlineStatus: (online) => {
        set({ 
          isOnline: online, 
          offlineMode: !online 
        });
      },

      cleanup: () => {
        const { howl } = get();
        if (howl) {
          howl.unload();
        }
        set({ howl: null });
      },
    }),
    {
      name: 'youngmuff-player',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} })),
      partialize: (state) => ({
        currentTrack: state.currentTrack,
        currentIndex: state.currentIndex,
        volume: state.volume,
        isShuffled: state.isShuffled,
        repeatMode: state.repeatMode,
        history: state.history.slice(0, 10), // Solo guardar últimos 10
        likedTracks: state.likedTracks,
      }),
    }
  )
);

export default usePlayerStore;