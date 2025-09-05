import { NextResponse } from 'next/server';
import { Track } from '@/lib/stores/player-store';

// Simulamos la data de tracks (en producción vendría de una base de datos)
const tracks: Track[] = [
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
  {
    id: '3',
    title: 'FOU FOU',
    artist: 'YOUNGMUFF',
    audioUrl: 'https://res.cloudinary.com/dt5pkdr0k/video/upload/v1739810252/12-_FOU_FOU_brc7jo.mp3',
    r2Url: 'audio/fou-fou.mp3',
    duration: '3:14',
    genre: 'R&B',
    thumbnail: '/images/FREEMAIKOL-FINAL.gif',
    downloadable: true,
  },
  {
    id: '4',
    title: 'SIA',
    artist: 'YOUNGMUFF',
    audioUrl: 'https://res.cloudinary.com/dt5pkdr0k/video/upload/v1739810261/13._SIA_im90kd.wav',
    r2Url: 'audio/sia.wav',
    duration: '3:14',
    genre: 'R&B',
    thumbnail: '/images/FREEMAIKOL-FINAL.gif',
    downloadable: true,
  },
  {
    id: '5',
    title: 'SIRI',
    artist: 'YOUNGMUFF feat. Akapellah, Jambenê, Angelo Reeves',
    audioUrl: 'https://res.cloudinary.com/dt5pkdr0k/video/upload/v1739810252/Machine_-_SIRI_Ft_Akapellah_Maiky_Moves_Jambene%CC%81_Angelo_Reeves_-_Prod_by_Carze%CC%81_Video_Oficial_l5ye1a.mp3',
    r2Url: 'audio/siri.mp3',
    duration: '3:14',
    genre: 'R&B',
    thumbnail: '/images/FREEMAIKOL-FINAL.gif',
    downloadable: true,
  },
  {
    id: '6',
    title: 'MIENTRAS SALGO #1',
    artist: 'YOUNGMUFF',
    audioUrl: 'https://res.cloudinary.com/dt5pkdr0k/video/upload/v1739810258/Mientras_Salgo_1_tstiu1.mp3',
    r2Url: 'audio/mientras-salgo-1.mp3',
    duration: '3:14',
    genre: 'R&B',
    thumbnail: '/images/FREEMAIKOL-FINAL.gif',
    downloadable: true,
  },
  {
    id: '7',
    title: 'MIENTRAS SALGO #2',
    artist: 'YOUNGMUFF',
    audioUrl: 'https://res.cloudinary.com/dt5pkdr0k/video/upload/v1739810252/Mientras_Salgo_2_kcv6b7.mp3',
    r2Url: 'audio/mientras-salgo-2.mp3',
    duration: '3:14',
    genre: 'Urban',
    thumbnail: '/images/FREEMAIKOL-FINAL.gif',
    downloadable: true,
  },
  {
    id: '8',
    title: 'MIENTRAS SALGO #3',
    artist: 'YOUNGMUFF',
    audioUrl: 'https://res.cloudinary.com/dt5pkdr0k/video/upload/v1739810259/Mientras_Salgo_3_z9raoa.mp3',
    r2Url: 'audio/mientras-salgo-3.mp3',
    duration: '3:14',
    genre: 'Urban',
    thumbnail: '/images/FREEMAIKOL-FINAL.gif',
    downloadable: true,
  },
];

export async function GET() {
  try {
    // En producción, aquí harías una consulta a tu base de datos
    // const tracks = await prisma.track.findMany({
    //   where: { published: true },
    //   orderBy: { createdAt: 'desc' }
    // });

    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json(
      { error: 'Error fetching tracks' },
      { status: 500 }
    );
  }
}

// Endpoint para obtener un track específico
export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    const track = tracks.find(t => t.id === id);
    
    if (!track) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(track);
  } catch (error) {
    console.error('Error fetching track:', error);
    return NextResponse.json(
      { error: 'Error fetching track' },
      { status: 500 }
    );
  }
}