import type { Metadata } from 'next';
import { Inter, Inconsolata } from 'next/font/google';
import { Providers } from './providers';
import Navigation from '@/components/layout/Navigation';
import AudioPlayer from '@/components/Player/AudioPlayer';
import PWAInstaller from '@/components/PWA/PWAInstaller';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const inconsolata = Inconsolata({
    subsets: ['latin'],
    variable: '--font-inconsolata',
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        default: 'YOUNGMUFF - Música y Merchandise',
        template: '%s | YOUNGMUFF',
    },
    description: 'Plataforma oficial de streaming musical y merchandise de YOUNGMUFF. Escucha los últimos tracks y descubre la colección de ropa.',
    keywords: ['YOUNGMUFF', 'música', 'streaming', 'R&B', 'urban', 'merchandise', 'ropa'],
    authors: [{ name: 'YOUNGMUFF' }],
    creator: 'YOUNGMUFF',
    publisher: 'YOUNGMUFF',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://youngmuff.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'es_ES',
        url: '/',
        siteName: 'YOUNGMUFF',
        title: 'YOUNGMUFF - Música y Merchandise',
        description: 'Plataforma oficial de streaming musical y merchandise de YOUNGMUFF',
        images: [
            {
                url: '/images/logo-full.png',
                width: 1200,
                height: 630,
                alt: 'YOUNGMUFF',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'YOUNGMUFF - Música y Merchandise',
        description: 'Plataforma oficial de streaming musical y merchandise de YOUNGMUFF',
        images: ['/images/logo-full.png'],
        creator: '@youngmuff',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    manifest: '/manifest.json',
    icons: {
        icon: '/favicon.png',
        shortcut: '/favicon.ico',
        apple: '/images/logo.png',
        other: [
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '32x32',
                url: '/favicon.png',
            },
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '16x16',
                url: '/favicon.png',
            },
            {
                rel: 'apple-touch-icon',
                sizes: '180x180',
                url: '/images/logo.png',
            },
        ],
    },
    verification: {
        google: process.env.GOOGLE_VERIFICATION,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" className={`${inter.variable} ${inconsolata.variable}`}>
            <head>
                {/* Preconnect a dominios externos */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link rel="preconnect" href="https://res.cloudinary.com" />
                {process.env.NEXT_PUBLIC_R2_URL && (
                    <link rel="preconnect" href={process.env.NEXT_PUBLIC_R2_URL} />
                )}

                {/* DNS prefetch para mejor performance */}
                <link rel="dns-prefetch" href="https://www.youtube.com" />
                <link rel="dns-prefetch" href="https://open.spotify.com" />

                {/* Viewport meta para PWA */}
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
                <meta name="theme-color" content="#0c0c0d" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="YOUNGMUFF" />

                {/* Preload de recursos críticos */}
                <link rel="preload" href="/images/logo.png" as="image" />
                <link rel="preload" href="/images/logo-full.png" as="image" />
                <link rel="preload" href="/images/hero-bg.jpg" as="image" />
                <link rel="preload" href="/images/FREEMAIKOL-FINAL.gif" as="image" />
                <link rel="preload" href="/api/tracks" as="fetch" crossOrigin="anonymous" />
            </head>
            <body className="bg-background text-white font-inter antialiased" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
                <Providers>
                    {/* Navegación */}
                    <Navigation />

                    {/* Contenido principal */}
                    <main className="pb-20 sm:pb-24 lg:pb-28 min-h-screen">
                        {children}
                    </main>

                    {/* Reproductor persistente */}
                    <AudioPlayer />

                    {/* Instalador PWA */}
                    <PWAInstaller />
                </Providers>

                {/* Scripts de analytics y otros servicios */}
                {process.env.NODE_ENV === 'production' && (
                    <>
                        {/* Google Analytics */}
                        {process.env.NEXT_PUBLIC_GA_ID && (
                            <>
                                <script
                                    async
                                    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                                />
                                <script
                                    dangerouslySetInnerHTML={{
                                        __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                        page_title: document.title,
                        page_location: window.location.href,
                      });
                    `,
                                    }}
                                />
                            </>
                        )}
                    </>
                )}
            </body>
        </html>
    );
}