import { usePWA } from '@/_core/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export function PWAUpdateNotification() {
  const { updateAvailable, updateServiceWorker } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!updateAvailable || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-l-4 border-[#D4AF37] rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-[#003366] mb-1">Actualización disponible</h3>
          <p className="text-sm text-gray-600 mb-3">
            Hay una nueva versión de IPA Xerez disponible.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={updateServiceWorker}
              size="sm"
              className="bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700]"
            >
              Actualizar ahora
            </Button>
            <Button
              onClick={() => setDismissed(true)}
              size="sm"
              variant="outline"
            >
              Más tarde
            </Button>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
