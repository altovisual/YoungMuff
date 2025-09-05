'use client';

import { useState } from 'react';
import { Share2, Copy, Check, ExternalLink } from 'lucide-react';

interface ShareData {
  title: string;
  text: string;
  url: string;
  image?: string;
}

interface ShareButtonProps {
  data: ShareData;
  className?: string;
  variant?: 'button' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export default function ShareButton({ 
  data, 
  className = '', 
  variant = 'button',
  size = 'md'
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const handleShare = async () => {
    if (!canShare) {
      setShowFallback(true);
      return;
    }

    setIsSharing(true);

    try {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url
      });
    } catch (error) {
      // Usuario canceló o error
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
        setShowFallback(true);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      const shareText = `${data.title}\n${data.text}\n${data.url}`;
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const shareToSocial = (platform: string) => {
    const encodedTitle = encodeURIComponent(data.title);
    const encodedText = encodeURIComponent(data.text);
    const encodedUrl = encodeURIComponent(data.url);

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    };

    const url = urls[platform as keyof typeof urls];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22
  };

  if (variant === 'icon') {
    return (
      <div className="relative">
        <button
          onClick={handleShare}
          disabled={isSharing}
          className={`p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 disabled:opacity-50 ${className}`}
          title="Compartir"
        >
          <Share2 size={iconSizes[size]} />
        </button>

        {showFallback && (
          <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-sm rounded-lg p-4 min-w-[250px] z-50 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-medium">Compartir</h4>
              <button
                onClick={() => setShowFallback(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                {copied ? 'Copiado!' : 'Copiar enlace'}
              </button>

              <div className="border-t border-white/10 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => shareToSocial('whatsapp')}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-green-500/20 rounded-lg transition-colors"
                  >
                    <ExternalLink size={14} />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => shareToSocial('twitter')}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-blue-500/20 rounded-lg transition-colors"
                  >
                    <ExternalLink size={14} />
                    Twitter
                  </button>
                  <button
                    onClick={() => shareToSocial('facebook')}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-blue-600/20 rounded-lg transition-colors"
                  >
                    <ExternalLink size={14} />
                    Facebook
                  </button>
                  <button
                    onClick={() => shareToSocial('telegram')}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-blue-400/20 rounded-lg transition-colors"
                  >
                    <ExternalLink size={14} />
                    Telegram
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={`flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 ${sizeClasses[size]} ${className}`}
      >
        <Share2 size={iconSizes[size]} />
        {isSharing ? 'Compartiendo...' : 'Compartir'}
      </button>

      {showFallback && (
        <div className="absolute top-full left-0 mt-2 bg-black/90 backdrop-blur-sm rounded-lg p-4 min-w-[280px] z-50 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium">Compartir</h4>
            <button
              onClick={() => setShowFallback(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="space-y-3">
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              {copied ? '¡Enlace copiado!' : 'Copiar enlace'}
            </button>

            <div className="border-t border-white/10 pt-3">
              <p className="text-gray-400 text-sm mb-2">Compartir en:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => shareToSocial('whatsapp')}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-green-500/20 rounded-lg transition-colors"
                >
                  <ExternalLink size={14} />
                  WhatsApp
                </button>
                <button
                  onClick={() => shareToSocial('twitter')}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-blue-500/20 rounded-lg transition-colors"
                >
                  <ExternalLink size={14} />
                  Twitter
                </button>
                <button
                  onClick={() => shareToSocial('facebook')}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-blue-600/20 rounded-lg transition-colors"
                >
                  <ExternalLink size={14} />
                  Facebook
                </button>
                <button
                  onClick={() => shareToSocial('telegram')}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-blue-400/20 rounded-lg transition-colors"
                >
                  <ExternalLink size={14} />
                  Telegram
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}