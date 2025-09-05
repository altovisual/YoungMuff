import { Suspense } from 'react';
import { Metadata } from 'next';
import Hero from '@/components/sections/Hero';
import PlaylistSection from '@/components/sections/PlaylistSection';
import VideoSection from '@/components/sections/VideoSection';
import { getTracks } from '@/lib/api/tracks';

export const metadata: Metadata = {
  title: 'YOUNGMUFF - Música y Merchandise',
  description: 'Plataforma oficial de streaming musical y merchandise de YOUNGMUFF. Escucha los últimos tracks y descubre la colección de ropa.',
  keywords: ['YOUNGMUFF', 'música', 'streaming', 'R&B', 'urban', 'merchandise'],
  openGraph: {
    title: 'YOUNGMUFF - Música y Merchandise',
    description: 'Plataforma oficial de streaming musical y merchandise de YOUNGMUFF',
    images: ['/images/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YOUNGMUFF - Música y Merchandise',
    description: 'Plataforma oficial de streaming musical y merchandise de YOUNGMUFF',
    images: ['/images/og-image.jpg'],
  },
};

export default async function HomePage() {
  // Obtener tracks del servidor
  const tracks = await getTracks();

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section con video */}
      <VideoSection />
      
      {/* Sección principal con playlist */}
      <Suspense fallback={<PlaylistSkeleton />}>
        <PlaylistSection tracks={tracks} />
      </Suspense>

      {/* Hero con información adicional */}
      <Hero />
    </main>
  );
}

// Skeleton loader para la playlist
function PlaylistSkeleton() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Lista de tracks skeleton */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-24 h-24 bg-fondo rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-8 w-32 bg-fondo rounded animate-pulse" />
                <div className="h-4 w-24 bg-fondo rounded animate-pulse" />
              </div>
            </div>
            
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3">
                <div className="w-12 h-12 bg-fondo rounded-md animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-fondo rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-fondo rounded animate-pulse" />
                </div>
                <div className="h-3 w-12 bg-fondo rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Artwork skeleton */}
          <div className="lg:sticky lg:top-8">
            <div className="aspect-square bg-fondo rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}