'use client';

import { useEffect } from 'react';
import usePlayerStore from '@/lib/stores/player-store';

export function useOnlineStatus() {
  const setOnlineStatus = usePlayerStore(state => state.setOnlineStatus);

  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    // Establecer estado inicial
    setOnlineStatus(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);
}