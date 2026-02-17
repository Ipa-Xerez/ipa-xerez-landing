import { usePWA } from '@/_core/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Download, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, install } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Verificar si PWA es soportada
    const supported = 'serviceWorker' in navigator && 'caches' in window;
    setIsSupported(supported);
    
    // Log para debugging
    console.log('[PWAInstallButton] isInstallable:', isInstallable);
    console.log('[PWAInstallButton] isInstalled:', isInstalled);
    console.log('[PWAInstallButton] isSupported:', supported);
  }, [isInstallable, isInstalled]);

  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 px-3 py-2 rounded-lg bg-green-50">
        <Check className="w-4 h-4" />
        <span className="hidden sm:inline">App instalada</span>
      </div>
    );
  }

  // Si no es instalable y no es soportado, no mostrar nada
  if (!isInstallable || !isSupported) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await install();
    } catch (error) {
      console.error('[PWAInstallButton] Install error:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <Button
      onClick={handleInstall}
      disabled={isInstalling}
      className="flex items-center gap-2 bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700] text-sm md:text-base font-bold"
      title="Instalar IPA Xerez como aplicación"
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">{isInstalling ? 'Instalando...' : 'Instalar App'}</span>
      <span className="sm:hidden">{isInstalling ? '...' : 'App'}</span>
    </Button>
  );
}
