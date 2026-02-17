import { useEffect, useState } from 'react';

export interface PWAInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface UsePWAReturn {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  installPrompt: PWAInstallPromptEvent | null;
  install: () => Promise<void>;
  updateAvailable: boolean;
  updateServiceWorker: () => void;
}

export function usePWA(): UsePWAReturn {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPromptEvent | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Detectar si la app está instalada
    const isInstalledCheck = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                    (document.referrer === '' || document.referrer.includes('apple.com'));
      return isStandalone || isIOS;
    };

    setIsInstalled(isInstalledCheck());

    // Detectar cambios en el modo de pantalla
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = () => setIsInstalled(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Escuchar evento de instalación
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setIsInstallable(true);
      setInstallPrompt(e as PWAInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setInstallPrompt(null);
      setIsInstalled(true);
      console.log('[PWA] App installed successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    // Escuchar cambios de conexión
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Registrar service worker y detectar actualizaciones
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          setRegistration(reg);
          console.log('[PWA] Service Worker registered');

          // Escuchar actualizaciones disponibles
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                  console.log('[PWA] Update available');
                }
              });
            }
          });
        })
        .catch(err => {
          console.error('[PWA] Service Worker registration failed:', err);
        });
    }
  }, []);

  const install = async () => {
    if (!installPrompt) {
      console.warn('[PWA] Install prompt not available');
      return;
    }

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.log('[PWA] User choice:', outcome);
      
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setInstallPrompt(null);
      }
    } catch (error) {
      console.error('[PWA] Installation failed:', error);
    }
  };

  const updateServiceWorker = () => {
    if (!registration) {
      console.warn('[PWA] Service Worker registration not available');
      return;
    }

    // Buscar actualizaciones
    registration.update()
      .then(() => {
        const newWorker = registration.installing;
        if (newWorker) {
          // Enviar mensaje al nuevo worker para que salte la espera
          newWorker.postMessage({ type: 'SKIP_WAITING' });
          
          // Recargar la página cuando el nuevo worker esté activo
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          });
        }
      })
      .catch(err => {
        console.error('[PWA] Update check failed:', err);
      });
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    installPrompt,
    install,
    updateAvailable,
    updateServiceWorker
  };
}
