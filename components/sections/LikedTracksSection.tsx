'use client';

import { motion } from 'framer-motion';
import { Heart, Music } from 'lucide-react';
import usePlayerStore from '@/lib/stores/player-store';
import TrackList from '@/components/Player/TrackList';

const LikedTracksSection = () => {
  const { tracks, likedTracks } = usePlayerStore();
  
  // Filtrar solo las canciones que le gustan al usuario
  const likedTracksList = tracks.filter(track => likedTracks.includes(track.id));

  if (likedTracksList.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-grey mr-3" />
              <h2 className="text-2xl font-bold text-white">Canciones que te gustan</h2>
            </div>
            
            <div className="bg-fondo rounded-lg p-8 max-w-md mx-auto">
              <Music className="w-12 h-12 text-grey mx-auto mb-4" />
              <p className="text-grey text-lg mb-2">No tienes canciones favoritas aún</p>
              <p className="text-grey/70 text-sm">
                Dale &quot;me gusta&quot; a las canciones que más te gusten para verlas aquí
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center mb-8">
            <Heart className="w-8 h-8 text-red-500 mr-3 fill-red-500" />
            <h2 className="text-2xl font-bold text-white">
              Canciones que te gustan
            </h2>
            <span className="ml-3 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
              {likedTracksList.length}
            </span>
          </div>

          <div className="bg-fondo rounded-lg p-6">
            <TrackList 
              tracks={likedTracksList}
              showArtwork={true}
              showIndex={false}
              className="space-y-2"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LikedTracksSection;