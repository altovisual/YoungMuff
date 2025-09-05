// PWA Manager Avanzado para YOUNGMUFF
class PWAManager {
  constructor() {
    this.isInstalled = false;
    this.deferredPrompt = null;
    this.registration = null;
    this.isOnline = navigator.onLine;
    this.pushSubscription = null;
    
    this.init();
  }

  async init() {
    // Registrar Service Worker
    await this.registerServiceWorker();
    
    // Configurar funcionalidades PWA
    this.checkInstallStatus();
    this.setupInstallPrompt();
    this.setupNetworkDetection();
    this.setupPushNotifications();
    this.setupSharing();
    this.setupKeyboardShortcuts();
    this.setupVisibilityChange();
    
    // Precachear contenido crítico
    this.precacheContent();
    
    console.log('🚀 PWA Manager inicializado completamente');
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        console.log('✅ Service Worker registrado:', this.registration.scope);
        
        // Escuchar actualizaciones
        this.registration.addEventListener('updatefound', () => {
          console.log('🔄 Nueva versión disponible');
          this.handleServiceWorkerUpdate();
        });
        
        // Escuchar mensajes del SW
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleServiceWorkerMessage(event);
        });
        
      } catch (error) {
        console.error('❌ Error registrando Service Worker:', error);
      }
    }
  }

  checkInstallStatus() {
    // Verificar si está ejecutándose como PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone === true;
    
    if (isStandalone) {
      this.isInstalled = true;
      document.body.classList.add('pwa-installed');
      this.setupStandaloneFeatures();
    }
  }

  setupStandaloneFeatures() {
    // Configuraciones específicas para modo standalone
    document.body.classList.add('standalone-mode');
    
    // Manejar navegación con gestos
    this.setupGestureNavigation();
    
    // Configurar barra de estado
    this.setupStatusBar();
  }

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt();
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallPrompt();
      this.showWelcomeMessage();
      
      // Analytics
      this.trackEvent('pwa_installed');
    });
  }

  async installApp() {
    if (!this.deferredPrompt) return false;

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      console.log(`Usuario ${outcome === 'accepted' ? 'aceptó' : 'rechazó'} instalar la PWA`);
      
      this.deferredPrompt = null;
      return outcome === 'accepted';
    } catch (error) {
      console.error('Error durante la instalación:', error);
      return false;
    }
  }

  setupNetworkDetection() {
    const updateOnlineStatus = () => {
      this.isOnline = navigator.onLine;
      document.body.classList.toggle('offline', !this.isOnline);
      
      if (this.isOnline) {
        this.handleOnline();
      } else {
        this.handleOffline();
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Estado inicial
    updateOnlineStatus();
  }

  handleOnline() {
    console.log('🌐 Conexión restaurada');
    this.showNotification('Conexión restaurada', 'success');
    
    // Sincronizar datos pendientes
    this.syncPendingData();
  }

  handleOffline() {
    console.log('📡 Sin conexión - Modo offline activado');
    this.showNotification('Modo offline activado', 'info');
  }

  async setupPushNotifications() {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.log('Push notifications no soportadas');
      return;
    }

    // Verificar suscripción existente
    if (this.registration) {
      this.pushSubscription = await this.registration.pushManager.getSubscription();
    }
  }

  setupSharing() {
    // Configurar Web Share API
    if ('share' in navigator) {
      document.body.classList.add('share-supported');
    }

    // Configurar Share Target
    this.handleSharedContent();
  }

  handleSharedContent() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('shared_title') || urlParams.has('shared_text')) {
      const sharedData = {
        title: urlParams.get('shared_title'),
        text: urlParams.get('shared_text'),
        url: urlParams.get('shared_url')
      };
      
      console.log('Contenido compartido recibido:', sharedData);
      this.processSharedContent(sharedData);
    }
  }

  processSharedContent(data) {
    // Mostrar contenido compartido al usuario
    this.showNotification(`Contenido compartido: ${data.title || data.text}`, 'info');
    
    // Limpiar URL
    const cleanUrl = new URL(window.location);
    cleanUrl.searchParams.delete('shared_title');
    cleanUrl.searchParams.delete('shared_text');
    cleanUrl.searchParams.delete('shared_url');
    window.history.replaceState({}, '', cleanUrl);
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K para buscar
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.openSearch();
      }
      
      // Espacio para play/pause
      if (e.code === 'Space' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        this.togglePlayback();
      }
      
      // Flechas para navegación de tracks
      if (e.key === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.previousTrack();
      }
      
      if (e.key === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.nextTrack();
      }
    });
  }

  setupVisibilityChange() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // App en background
        this.handleAppBackground();
      } else {
        // App en foreground
        this.handleAppForeground();
      }
    });
  }

  setupGestureNavigation() {
    let startX, startY;
    
    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      // Swipe horizontal para cambiar tracks
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.nextTrack();
        } else {
          this.previousTrack();
        }
      }
      
      startX = startY = null;
    });
  }

  async precacheContent() {
    if (!this.registration) return;
    
    // Obtener lista de tracks
    try {
      const response = await fetch('/api/tracks');
      const tracks = await response.json();
      
      // Precachear primeros 3 tracks
      const priorityTracks = tracks.slice(0, 3);
      const audioUrls = priorityTracks.map(track => track.audio_url).filter(Boolean);
      
      if (audioUrls.length > 0) {
        navigator.serviceWorker.controller?.postMessage({
          type: 'PRECACHE_AUDIO',
          audioUrls
        });
      }
    } catch (error) {
      console.log('Error precaching content:', error);
    }
  }

  async syncPendingData() {
    if (!this.registration) return;
    
    try {
      await this.registration.sync.register('sync-tracks');
    } catch (error) {
      console.log('Background sync no soportado');
    }
  }

  handleServiceWorkerUpdate() {
    const newWorker = this.registration.installing;
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        this.showUpdatePrompt();
      }
    });
  }

  handleServiceWorkerMessage(event) {
    const { data } = event;
    
    switch (data.type) {
      case 'TRACKS_SYNCED':
        console.log('Tracks sincronizados:', data.tracks.length);
        break;
        
      case 'CACHE_UPDATED':
        console.log('Cache actualizado');
        break;
    }
  }

  showInstallPrompt() {
    const prompt = document.createElement('div');
    prompt.id = 'install-prompt';
    prompt.className = 'install-prompt';
    prompt.innerHTML = `
      <div class="install-prompt-content">
        <div class="install-prompt-icon">📱</div>
        <div class="install-prompt-text">
          <h3>Instalar YOUNGMUFF</h3>
          <p>Instala la app para una mejor experiencia</p>
        </div>
        <div class="install-prompt-actions">
          <button class="install-btn" onclick="pwaManager.installApp()">Instalar</button>
          <button class="dismiss-btn" onclick="this.closest('.install-prompt').remove()">×</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(prompt);
    
    // Auto-hide después de 10 segundos
    setTimeout(() => {
      if (prompt.parentNode) {
        prompt.remove();
      }
    }, 10000);
  }

  hideInstallPrompt() {
    const prompt = document.getElementById('install-prompt');
    if (prompt) {
      prompt.remove();
    }
  }

  showUpdatePrompt() {
    const prompt = document.createElement('div');
    prompt.className = 'update-prompt';
    prompt.innerHTML = `
      <div class="update-prompt-content">
        <span>Nueva versión disponible</span>
        <button onclick="pwaManager.updateApp()">Actualizar</button>
        <button onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    document.body.appendChild(prompt);
  }

  async updateApp() {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  showWelcomeMessage() {
    this.showNotification('¡Bienvenido a YOUNGMUFF! App instalada correctamente', 'success');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `pwa-notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Métodos de integración con el player
  openSearch() {
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) {
      searchInput.focus();
    }
  }

  togglePlayback() {
    const playBtn = document.querySelector('[data-action="play"], [data-action="pause"]');
    if (playBtn) {
      playBtn.click();
    }
  }

  nextTrack() {
    const nextBtn = document.querySelector('[data-action="next"]');
    if (nextBtn) {
      nextBtn.click();
    }
  }

  previousTrack() {
    const prevBtn = document.querySelector('[data-action="previous"]');
    if (prevBtn) {
      prevBtn.click();
    }
  }

  handleAppBackground() {
    // Reducir actividad cuando la app está en background
    console.log('App en background');
  }

  handleAppForeground() {
    // Reactivar cuando vuelve al foreground
    console.log('App en foreground');
  }

  setupStatusBar() {
    // Configurar color de barra de estado en dispositivos móviles
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = '#0c0c0d';
    }
  }

  trackEvent(eventName, data = {}) {
    // Analytics para eventos PWA
    console.log('PWA Event:', eventName, data);
  }
}

// Inicializar PWA Manager
const pwaManager = new PWAManager();