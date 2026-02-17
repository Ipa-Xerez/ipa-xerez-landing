import { usePWA } from '@/_core/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Download, Check } from 'lucide-react';
import { useState } from 'react';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, install } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);

  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 px-3 py-2 rounded-lg bg-green-50">
        <Check className="w-4 h-4" />
        <span>App instalada</span>
      </div>
    );
  }

  if (!isInstallable) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <Button
      onClick={handleInstall}
      disabled={isInstalling}
      className="flex items-center gap-2 bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700]"
      title="Instalar IPA Xerez como aplicación"
    >
      <Download className="w-4 h-4" />
      <span>{isInstalling ? 'Instalando...' : 'Instalar App'}</span>
    </Button>
  );
}
