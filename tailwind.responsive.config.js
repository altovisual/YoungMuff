// Tailwind CSS Responsive Configuration for YOUNGMUFF

module.exports = {
  theme: {
    extend: {
      // Custom breakpoints for better responsive control
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // Custom breakpoints for specific use cases
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1023px'},
        'desktop': {'min': '1024px'},
        // Landscape orientation
        'landscape': {'raw': '(orientation: landscape)'},
        // Height-based breakpoints
        'h-sm': {'raw': '(max-height: 600px)'},
        'h-md': {'raw': '(min-height: 601px) and (max-height: 900px)'},
        'h-lg': {'raw': '(min-height: 901px)'},
      },
      
      // Responsive spacing scale
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      
      // Responsive font sizes
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        // Responsive font sizes
        'responsive-xs': ['0.75rem', { lineHeight: '1rem' }],
        'responsive-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'responsive-base': ['1rem', { lineHeight: '1.5rem' }],
        'responsive-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'responsive-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'responsive-2xl': ['1.5rem', { lineHeight: '2rem' }],
      },
      
      // Container sizes
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '2.5rem',
          '2xl': '3rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },
      
      // Responsive grid templates
      gridTemplateColumns: {
        'responsive-2': 'repeat(1, minmax(0, 1fr))',
        'responsive-3': 'repeat(1, minmax(0, 1fr))',
        'responsive-4': 'repeat(1, minmax(0, 1fr))',
      },
      
      // Touch-friendly minimum sizes
      minHeight: {
        'touch': '44px',
        'touch-lg': '48px',
      },
      
      minWidth: {
        'touch': '44px',
        'touch-lg': '48px',
      },
      
      // Animation durations for different screen sizes
      transitionDuration: {
        'mobile': '200ms',
        'desktop': '300ms',
      },
      
      // Z-index scale
      zIndex: {
        'navigation': '40',
        'player': '50',
        'modal': '60',
        'toast': '70',
        'tooltip': '80',
        'dropdown': '90',
        'overlay': '100',
      },
    },
  },
  
  plugins: [
    // Plugin for responsive utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Safe area utilities
        '.safe-area-top': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.safe-area-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.safe-area-left': {
          paddingLeft: 'env(safe-area-inset-left)',
        },
        '.safe-area-right': {
          paddingRight: 'env(safe-area-inset-right)',
        },
        '.safe-area-inset': {
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        },
        
        // Touch-friendly utilities
        '.touch-target': {
          minHeight: '44px',
          minWidth: '44px',
        },
        '.touch-target-lg': {
          minHeight: '48px',
          minWidth: '48px',
        },
        
        // Responsive text utilities
        '.text-responsive-xs': {
          fontSize: '0.75rem',
          lineHeight: '1rem',
          '@screen sm': {
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
          },
        },
        '.text-responsive-sm': {
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          '@screen sm': {
            fontSize: '1rem',
            lineHeight: '1.5rem',
          },
        },
        '.text-responsive-base': {
          fontSize: '1rem',
          lineHeight: '1.5rem',
          '@screen sm': {
            fontSize: '1.125rem',
            lineHeight: '1.75rem',
          },
        },
        '.text-responsive-lg': {
          fontSize: '1.125rem',
          lineHeight: '1.75rem',
          '@screen sm': {
            fontSize: '1.25rem',
            lineHeight: '1.75rem',
          },
          '@screen lg': {
            fontSize: '1.5rem',
            lineHeight: '2rem',
          },
        },
        '.text-responsive-xl': {
          fontSize: '1.25rem',
          lineHeight: '1.75rem',
          '@screen sm': {
            fontSize: '1.5rem',
            lineHeight: '2rem',
          },
          '@screen lg': {
            fontSize: '1.875rem',
            lineHeight: '2.25rem',
          },
        },
        '.text-responsive-2xl': {
          fontSize: '1.5rem',
          lineHeight: '2rem',
          '@screen sm': {
            fontSize: '1.875rem',
            lineHeight: '2.25rem',
          },
          '@screen lg': {
            fontSize: '2.25rem',
            lineHeight: '2.5rem',
          },
        },
        
        // Container utilities
        '.container-responsive': {
          width: '100%',
          maxWidth: '1280px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          '@screen sm': {
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          },
          '@screen lg': {
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
        },
        
        // Responsive spacing utilities
        '.space-responsive-x > :not([hidden]) ~ :not([hidden])': {
          marginLeft: '0.5rem',
          '@screen sm': {
            marginLeft: '1rem',
          },
          '@screen lg': {
            marginLeft: '1.5rem',
          },
        },
        '.space-responsive-y > :not([hidden]) ~ :not([hidden])': {
          marginTop: '0.75rem',
          '@screen sm': {
            marginTop: '1rem',
          },
          '@screen lg': {
            marginTop: '1.5rem',
          },
        },
        
        // Responsive padding utilities
        '.p-responsive': {
          padding: '0.75rem',
          '@screen sm': {
            padding: '1rem',
          },
          '@screen lg': {
            padding: '1.5rem',
          },
        },
        '.px-responsive': {
          paddingLeft: '0.75rem',
          paddingRight: '0.75rem',
          '@screen sm': {
            paddingLeft: '1rem',
            paddingRight: '1rem',
          },
          '@screen lg': {
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          },
        },
        '.py-responsive': {
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem',
          '@screen sm': {
            paddingTop: '1rem',
            paddingBottom: '1rem',
          },
          '@screen lg': {
            paddingTop: '1.5rem',
            paddingBottom: '1.5rem',
          },
        },
        
        // Responsive grid utilities
        '.grid-responsive-2': {
          display: 'grid',
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          '@screen sm': {
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          },
        },
        '.grid-responsive-3': {
          display: 'grid',
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          '@screen sm': {
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          },
          '@screen lg': {
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          },
        },
        '.grid-responsive-4': {
          display: 'grid',
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          '@screen sm': {
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          },
          '@screen lg': {
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          },
          '@screen xl': {
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          },
        },
      };
      
      addUtilities(newUtilities);
    },
  ],
};