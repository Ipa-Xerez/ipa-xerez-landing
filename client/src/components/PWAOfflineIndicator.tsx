import { usePWA } from '@/_core/hooks/usePWA';
import { Wifi, WifiOff } from 'lucide-react';

export function PWAOfflineIndicator() {
  const { isOnline } = usePWA();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white px-4 py-3 flex items-center gap-2 z-40">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">
        Sin conexión a internet. Algunos contenidos pueden estar limitados.
      </span>
    </div>
  );
}
