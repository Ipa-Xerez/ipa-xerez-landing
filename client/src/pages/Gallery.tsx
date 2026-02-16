import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  description: string;
  category: "viajes" | "eventos" | "cultura";
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: "1",
    src: "/20251011_095840~2.jpg",
    title: "Embarque en Nueva York",
    description: "Miembros de IPA Xerez embarcando en el viaje a Nueva York. Momento de camaradería antes de la aventura internacional.",
    category: "viajes"
  },
  {
    id: "2",
    src: "/20251011_102657(1).jpg",
    title: "Paseo en Bote por Nueva York",
    description: "Experiencia inolvidable navegando por Nueva York con el Puente de Brooklyn de fondo. Hermandad internacional en acción.",
    category: "viajes"
  },
  {
    id: "3",
    src: "/20251010_104741.jpg",
    title: "Presentación Educativa",
    description: "Evento educativo con presentación de seguridad en institución académica. Compartiendo conocimiento profesional.",
    category: "eventos"
  },
  {
    id: "4",
    src: "/20251010_103523.jpg",
    title: "Visita Estación NYPD",
    description: "Grupo de IPA Xerez visitando la estación de policía de Nueva York. Intercambio profesional y cooperación internacional.",
    category: "eventos"
  },
  {
    id: "5",
    src: "/20251010_125254.jpg",
    title: "Encuentro en Times Square",
    description: "Miembros de IPA reunidos en Times Square, Nueva York. Momento de convivencia en la ciudad que nunca duerme.",
    category: "viajes"
  },
  {
    id: "6",
    src: "/20251008_150017.jpg",
    title: "Grupo en Aeropuerto Internacional",
    description: "Grupo completo en aeropuerto con banderas de USA y España. Símbolo de la hermandad policial sin fronteras.",
    category: "eventos"
  },
  {
    id: "7",
    src: "/20251008_150027(0).jpg",
    title: "Delegación IPA Xerez",
    description: "Delegación oficial de IPA Xerez con bandera de Madrid. Representando a España en el escenario internacional.",
    category: "eventos"
  },
  {
    id: "8",
    src: "/IMG-20250913-WA0033.jpg",
    title: "Paseos en Camello en Marruecos",
    description: "Actividad cultural en playas de Marruecos. Experiencias compartidas que crean lazos de amistad duraderos.",
    category: "cultura"
  },
  {
    id: "9",
    src: "/IMG-20250915-WA0054.jpg",
    title: "Medina Azul de Chefchaouen",
    description: "Visita a la icónica medina azul de Chefchaouen, Marruecos. Descubriendo la belleza cultural del norte africano.",
    category: "cultura"
  },
  {
    id: "10",
    src: "/IMG-20250913-WA0013.jpg",
    title: "Grupo en Alcazaba de Almería",
    description: "Miembros de IPA en la histórica Alcazaba de Almería. Explorando el patrimonio cultural español juntos.",
    category: "cultura"
  },
  {
    id: "11",
    src: "/IMG-20250915-WA0027.jpg",
    title: "Artesanía Tradicional Marroquí",
    description: "Cestas y artículos tradicionales de Marruecos. Apoyo a la artesanía local durante nuestros viajes internacionales.",
    category: "cultura"
  },
  {
    id: "12",
    src: "/IMG-20250703-WA0022.jpg",
    title: "Itinerario Marruecos",
    description: "Viaje a Tánger, Tetuán, Chaouen y Asilah. Experiencia completa de la cultura y tradición marroquí con IPA Xerez.",
    category: "viajes"
  }
];

export default function Gallery() {
  const [, navigate] = useLocation();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "viajes" | "eventos" | "cultura">("all");

  const filteredImages = selectedCategory === "all" 
    ? GALLERY_IMAGES 
    : GALLERY_IMAGES.filter(img => img.category === selectedCategory);

  const currentIndex = selectedImage ? GALLERY_IMAGES.findIndex(img => img.id === selectedImage.id) : -1;

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setSelectedImage(GALLERY_IMAGES[currentIndex - 1]);
    } else {
      setSelectedImage(GALLERY_IMAGES[GALLERY_IMAGES.length - 1]);
    }
  };

  const goToNext = () => {
    if (currentIndex < GALLERY_IMAGES.length - 1) {
      setSelectedImage(GALLERY_IMAGES[currentIndex + 1]);
    } else {
      setSelectedImage(GALLERY_IMAGES[0]);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/AgkWeOTDyZirPRUK.png" alt="IPA Xerez" className="h-12 w-auto" />
            <span className="font-heading text-[#003366] text-xl hidden sm:inline font-bold">IPA Xerez</span>
          </div>
          <div className="flex gap-2 md:gap-4 items-center">
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5] text-sm md:text-base" onClick={() => navigate('/')}>Inicio</Button>
            <Button className="bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700] text-sm md:text-base font-bold" onClick={() => navigate('/')}>Volver</Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-[#003366] to-[#004d99] text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl mb-4 font-bold">Galería de Fotos</h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">Momentos especiales de IPA Xerez: viajes internacionales, eventos y experiencias culturales que fortalecen nuestra hermandad.</p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              onClick={() => setSelectedCategory("all")}
              className={`${selectedCategory === "all" ? "bg-[#003366] text-white" : "bg-white text-[#003366] border border-[#003366]"} hover:bg-[#003366] hover:text-white transition-colors`}
            >
              Todas las Fotos
            </Button>
            <Button 
              onClick={() => setSelectedCategory("viajes")}
              className={`${selectedCategory === "viajes" ? "bg-[#003366] text-white" : "bg-white text-[#003366] border border-[#003366]"} hover:bg-[#003366] hover:text-white transition-colors`}
            >
              ✈️ Viajes Internacionales
            </Button>
            <Button 
              onClick={() => setSelectedCategory("eventos")}
              className={`${selectedCategory === "eventos" ? "bg-[#003366] text-white" : "bg-white text-[#003366] border border-[#003366]"} hover:bg-[#003366] hover:text-white transition-colors`}
            >
              🎯 Eventos
            </Button>
            <Button 
              onClick={() => setSelectedCategory("cultura")}
              className={`${selectedCategory === "cultura" ? "bg-[#003366] text-white" : "bg-white text-[#003366] border border-[#003366]"} hover:bg-[#003366] hover:text-white transition-colors`}
            >
              🏛️ Cultura
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div 
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative overflow-hidden bg-gray-200 aspect-square">
                  <img 
                    src={image.src} 
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-lg text-[#003366] font-semibold mb-2">{image.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{image.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image Container */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>

            {/* Info */}
            <div className="mt-4 bg-white rounded-lg p-6">
              <h2 className="font-heading text-2xl text-[#003366] mb-2 font-bold">{selectedImage.title}</h2>
              <p className="text-gray-700 text-lg mb-4">{selectedImage.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {currentIndex + 1} de {GALLERY_IMAGES.length}
                </span>
                <div className="flex gap-3">
                  <Button
                    onClick={goToPrevious}
                    variant="outline"
                    className="border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={goToNext}
                    className="bg-[#003366] text-white hover:bg-[#1A3A52]"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#003366] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-heading text-lg mb-4">IPA Xerez</h4>
              <p className="text-gray-300 text-sm">Servo per Amikeco</p>
            </div>
            <div>
              <h4 className="font-heading text-lg mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/" className="hover:text-[#D4AF37]">Inicio</a></li>
                <li><a href="/" className="hover:text-[#D4AF37]">Galería</a></li>
                <li><a href="https://ipa-spain.org" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37]">IPA España</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-lg mb-4">Síguenos</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="https://www.facebook.com/profile.php?id=61572445883496" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37]">Facebook</a></li>
                <li><a href="https://instagram.com/ipa_xerez" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37]">Instagram</a></li>
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
