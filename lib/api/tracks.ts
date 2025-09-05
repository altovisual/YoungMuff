import { Track } from '@/lib/stores/player-store';

export async function getTracks(): Promise<Track[]> {
  try {
    const response = await fetch('/api/tracks', {
      next: { revalidate: 3600 }, // Revalidar cada hora
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tracks');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching tracks:', error);
    // Retornar tracks por defecto en caso de error
    return getDefaultTracks();
  }
}

export async function getTrack(id: string): Promise<Track | null> {
  try {
    const response = await fetch('/api/tracks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching track:', error);
    return null;
  }
}

function getDefaultTracks(): Track[] {
  return [
    {
      id: '1',
      title: 'FREEMAIKY',
      artist: 'YOUNGMUFF',
      audioUrl: 'https://res.cloudinary.com/dt5pkdr0k/video/upload/v1739810727/Free_Master_Video_48x24_V3_t4f0eu.wav',
      r2Url: 'audio/freemaiky.wav',
      duration: '3:14',
      genre: 'R&B',
      thumbnail: '/images/FREEMAIKOL-FINAL.gif',
      downloadable: true,
    },
    {
      id: '2',
      title: 'VIERNES',
      artist: 'YOUNGMUFF',
      audioUrl: 'https://res.cloudinary.com/dt5pkdr0k/video/upload/v1739810255/01_VIERNES_czpf4b.mp3',
      r2Url: 'audio/viernes.mp3',
      duration: '3:14',
      genre: 'R&B',
      thumbnail: '/images/FREEMAIKOL-FINAL.gif',
      downloadable: true,
    },
  ];
}