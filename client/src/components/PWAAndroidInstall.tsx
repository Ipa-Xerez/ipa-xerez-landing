import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

export function PWAAndroidInstall() {
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detectar si es Android
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroidDevice = /android/.test(userAgent);
    
    // Detectar si tiene service worker
    const hasServiceWorker = 'serviceWorker' in navigator;
    
    // Detectar si ya está instalada
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    // Mostrar prompt solo si es Android, tiene service worker y no está instalada
    if (isAndroidDevice && hasServiceWorker && !isInstalled) {
      setIsAndroid(true);
      
      // Mostrar después de 3 segundos
      const timer = setTimeout(() => {
        setShowAndroidPrompt(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  if (!showAndroidPrompt || !isAndroid) {
    return null;
  }

  const handleInstallClick = () => {
    // Mostrar instrucciones de instalación
    alert(
      'Para instalar IPA Xerez en tu dispositivo Android:\n\n' +
      '1. Toca el menú (⋮) en la esquina superior derecha\n' +
      '2. Selecciona "Instalar aplicación" o "Agregar a pantalla de inicio"\n' +
      '3. Confirma la instalación\n\n' +
      'La aplicación se instalará como una app nativa en tu dispositivo.'
    );
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white border-l-4 border-[#D4AF37] rounded-lg shadow-lg p-4 z-40 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-start gap-3">
        <Download className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-[#003366] mb-1">Instala IPA Xerez</h3>
          <p className="text-sm text-gray-600 mb-3">
            Accede a la aplicación directamente desde tu pantalla de inicio.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleInstallClick}
              size="sm"
              className="bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700]"
            >
              Ver instrucciones
            </Button>
            <Button
              onClick={() => setShowAndroidPrompt(false)}
              size="sm"
              variant="outline"
            >
              Más tarde
            </Button>
          </div>
        </div>
        <button
          onClick={() => setShowAndroidPrompt(false)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
