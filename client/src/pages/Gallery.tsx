import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Gallery() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#003366] text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
              <span className="text-[#003366] font-bold text-sm">IPA</span>
            </div>
            <h1 className="font-heading text-xl font-bold">IPA Xerez</h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="font-heading text-4xl text-[#003366] mb-4">Galería de Actividades</h2>
          <p className="text-gray-600 text-lg">
            Explora nuestras actividades, eventos e intercambios internacionales
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-64 flex items-center justify-center"
            >
              <div className="text-center text-gray-500">
                <p className="text-lg font-semibold">Foto {item}</p>
                <p className="text-sm">Agrega tu foto aquí</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">
            La galería está lista para ser completada con tus fotos de actividades y eventos.
          </p>
          <p className="text-sm text-gray-500">
            Próximamente: Agrega fotos de tus eventos, intercambios y actividades de IPA Xerez
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#003366] text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-heading text-lg mb-4">IPA Xerez</h4>
              <p className="text-gray-300 text-sm">Servo per Amikeco</p>
            </div>
            <div>
              <h4 className="font-heading text-lg mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><button onClick={() => navigate("/")} className="hover:text-[#D4AF37]">Inicio</button></li>
                <li><button onClick={() => navigate("/blog")} className="hover:text-[#D4AF37]">Blog</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-lg mb-4">Síguenos</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="https://facebook.com/Ipa-Xerez" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37]">Facebook</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-lg mb-4">Contacto</h4>
              <p className="text-sm text-gray-300">ipaagrupacionxerez@gmail.com</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 IPA Agrupacion Xerez.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
