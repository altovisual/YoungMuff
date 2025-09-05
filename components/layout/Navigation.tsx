'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import Logo from '@/components/ui/Logo'; // Logo removido

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-stroke" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="max-w-screen-xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/Maiki-logo.png"
              alt="Maiky Moves Logo"
              width={100}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-white hover:text-primary transition-colors"
            >
              Música
            </Link>
            <Link 
              href="/merchandise" 
              className="text-grey hover:text-white transition-colors"
            >
              Ropa
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {/* Search (desktop) */}
            <button 
              className="hidden md:block p-1.5 lg:p-2 text-grey hover:text-white transition-colors flex items-center justify-center"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <Search className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>

            {/* Social Links */}
            <div className="hidden lg:flex items-center space-x-2">
              <a
                href="https://www.youtube.com/@MaikyMoves"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity p-2 flex items-center justify-center"
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                <span className="text-xs text-grey">YT</span>
              </a>
              <a
                href="https://open.spotify.com/intl-es/artist/3CYn5NgjKp6OG72lmtbiqL"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity p-2 flex items-center justify-center"
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                <span className="text-xs text-grey">SP</span>
              </a>
            </div>

            {/* Cart */}
            <button 
              className="relative p-1.5 sm:p-2 text-grey hover:text-white transition-colors flex items-center justify-center"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-primary text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-1.5 text-grey hover:text-white transition-colors flex items-center justify-center"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-stroke"
          >
            <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
              <Link
                href="/"
                className="block text-white hover:text-primary transition-colors py-3 text-base sm:text-lg font-medium flex items-center"
                onClick={() => setIsMenuOpen(false)}
                style={{ minHeight: '44px' }}
              >
                Música
              </Link>
              <Link
                href="/merchandise"
                className="block text-grey hover:text-white transition-colors py-3 text-base sm:text-lg font-medium flex items-center"
                onClick={() => setIsMenuOpen(false)}
                style={{ minHeight: '44px' }}
              >
                Ropa
              </Link>
              
              <div className="pt-3 sm:pt-4 border-t border-stroke">
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <a
                    href="https://www.youtube.com/@MaikyMoves"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-70 hover:opacity-100 transition-opacity p-2 flex items-center justify-center"
                    style={{ minHeight: '44px', minWidth: '44px' }}
                  >
                    <Image
                      src="/images/Recurso-7saint.png"
                      alt="YouTube"
                      width={50}
                      height={12}
                      className="sm:w-[60px] sm:h-[15px]"
                    />
                  </a>
                  <a
                    href="https://open.spotify.com/intl-es/artist/3CYn5NgjKp6OG72lmtbiqL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-70 hover:opacity-100 transition-opacity p-2 flex items-center justify-center"
                    style={{ minHeight: '44px', minWidth: '44px' }}
                  >
                    <Image
                      src="/images/Recurso-8saint.png"
                      alt="Spotify"
                      width={50}
                      height={16}
                      className="sm:w-[60px] sm:h-[20px]"
                    />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;