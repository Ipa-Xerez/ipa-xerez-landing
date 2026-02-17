import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Download, Smartphone, Chrome, Smartphone as AppleIcon, Zap } from "lucide-react";

export default function InstallGuide() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/AgkWeOTDyZirPRUK.png" 
              alt="IPA Xerez" 
              className="h-12 w-auto" 
            />
            <span className="font-heading text-[#003366] text-xl hidden sm:inline font-bold">IPA Xerez</span>
          </div>
          <Button 
            variant="ghost" 
            className="text-[#003366] hover:bg-[#F5F5F5]" 
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Download className="w-16 h-16 text-[#D4AF37]" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-[#003366] mb-4 font-bold">
              Instala IPA Xerez
            </h1>
            <p className="text-xl text-gray-600">
              Accede a la aplicación directamente desde tu dispositivo como una app nativa
            </p>
          </div>

          {/* Android Instructions */}
          <div className="mb-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-6">
              <Smartphone className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-blue-900">Android</h2>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Abre el navegador</h3>
                  <p className="text-gray-700">
                    Asegúrate de estar usando Chrome, Firefox o cualquier navegador moderno
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Toca el menú (⋮)</h3>
                  <p className="text-gray-700">
                    Busca el botón de menú en la esquina superior derecha del navegador
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Selecciona la opción de instalación</h3>
                  <p className="text-gray-700">
                    Busca "Instalar aplicación", "Agregar a pantalla de inicio" o "Instalar IPA Xerez"
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Confirma la instalación</h3>
                  <p className="text-gray-700">
                    Toca "Instalar" en el diálogo de confirmación. ¡Listo!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* iOS Instructions */}
          <div className="mb-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8 border-l-4 border-gray-500">
            <div className="flex items-center gap-3 mb-6">
              <AppleIcon className="w-8 h-8 text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-900">iOS (iPhone/iPad)</h2>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Abre Safari</h3>
                  <p className="text-gray-700">
                    Usa el navegador Safari para la mejor experiencia PWA
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Toca el botón Compartir</h3>
                  <p className="text-gray-700">
                    Busca el ícono de compartir (cuadrado con flecha) en la parte inferior
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Selecciona "Agregar a pantalla de inicio"</h3>
                  <p className="text-gray-700">
                    Desplázate hacia abajo en el menú para encontrar esta opción
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Confirma y agrega</h3>
                  <p className="text-gray-700">
                    Toca "Agregar" en la esquina superior derecha. ¡Listo!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-[#F5F5F5] rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-[#003366] mb-6">Beneficios de instalar la app</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <Zap className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Acceso rápido</h3>
                  <p className="text-gray-600">
                    Abre la app directamente desde tu pantalla de inicio sin pasar por el navegador
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Download className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Funciona sin conexión</h3>
                  <p className="text-gray-600">
                    Accede a contenido previamente cargado incluso sin conexión a internet
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Smartphone className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Experiencia nativa</h3>
                  <p className="text-gray-600">
                    Disfruta de una experiencia similar a la de una app nativa
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Chrome className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Actualizaciones automáticas</h3>
                  <p className="text-gray-600">
                    Recibe actualizaciones automáticas sin necesidad de visitar una tienda de apps
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              onClick={() => navigate('/')}
              className="bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700] text-lg px-8 py-6 font-bold"
            >
              Volver al sitio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
