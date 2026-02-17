import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Share2, ZoomIn } from "lucide-react";
import { useLocation } from "wouter";
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";

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
    title: "Viaje a Nueva York - Día de la Hispanidad, IPA Madrid Octubre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "2",
    src: "/20251011_102657(1).jpg",
    title: "Viaje a Nueva York - Día de la Hispanidad, IPA Madrid Octubre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "3",
    src: "/20251010_104741.jpg",
    title: "Viaje a Nueva York - Día de la Hispanidad, IPA Madrid Octubre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "4",
    src: "/20251010_103523.jpg",
    title: "Viaje a Nueva York - Día de la Hispanidad, IPA Madrid Octubre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "5",
    src: "/20251010_125254.jpg",
    title: "Viaje a Nueva York - Día de la Hispanidad, IPA Madrid Octubre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "6",
    src: "/20251008_150017.jpg",
    title: "Viaje a Nueva York - Día de la Hispanidad, IPA Madrid Octubre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "7",
    src: "/20251008_150027(0).jpg",
    title: "Viaje a Nueva York - Día de la Hispanidad, IPA Madrid Octubre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "8",
    src: "/IMG-20250913-WA0033.jpg",
    title: "Ruta del Rif - Actividad IPA Xerez - Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "9",
    src: "/IMG-20250915-WA0054.jpg",
    title: "Ruta del Rif - Actividad IPA Xerez - Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "10",
    src: "/IMG-20250913-WA0013.jpg",
    title: "Ruta del Rif - Actividad IPA Xerez - Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "11",
    src: "/IMG-20250915-WA0027.jpg",
    title: "Ruta del Rif - Actividad IPA Xerez - Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "12",
    src: "/IMG-20250703-WA0022.jpg",
    title: "Ruta del Rif - Actividad IPA Xerez - Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "13",
    src: "/20250503_165049.jpg",
    title: "Actividad IPA Xerez en la Yeguada del Hierro del Bocado y Cartuja de Jerez - Junio 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "14",
    src: "/IMG-20250503-WA0050.jpg",
    title: "Actividad IPA Xerez en la Yeguada del Hierro del Bocado y Cartuja de Jerez - Junio 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "15",
    src: "/IMG-20250503-WA0063.jpg",
    title: "Actividad IPA Xerez en la Yeguada del Hierro del Bocado y Cartuja de Jerez - Junio 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "16",
    src: "/JuanDiegoyPaco.jpeg",
    title: "Actividad IPA Xerez en la Yeguada del Hierro del Bocado y Cartuja de Jerez - Junio 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "17",
    src: "/340c70f3-4b69-4fbd-b93f-5817ab43809e.jpeg",
    title: "Actividad IPA Xerez en la Yeguada del Hierro del Bocado y Cartuja de Jerez - Junio 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "18",
    src: "/20250503_133349.jpg",
    title: "Actividad IPA Xerez en la Yeguada del Hierro del Bocado y Cartuja de Jerez - Junio 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "19",
    src: "/20250503_133319.jpg",
    title: "Actividad IPA Xerez en la Yeguada del Hierro del Bocado y Cartuja de Jerez - Junio 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "20",
    src: "/20250503_121413.jpg",
    title: "Actividad IPA Xerez en la Yeguada del Hierro del Bocado y Cartuja de Jerez - Junio 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "21",
    src: "/20250503_123716.jpg",
    title: "Actividad IPA Xerez en la Yeguada del Hierro del Bocado y Cartuja de Jerez - Junio 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "22",
    src: "/20250503_153720.jpg",
    title: "Actividad IPA Xerez en la Yeguada del Hierro del Bocado y Cartuja de Jerez - Junio 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "23",
    src: "/20250503_114623.jpg",
    title: "Actividad IPA Xerez en la Yeguada del Hierro del Bocado y Cartuja de Jerez - Junio 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "24",
    src: "/20250503_155052.jpg",
    title: "Actividad IPA Xerez en la Yeguada del Hierro del Bocado y Cartuja de Jerez - Junio 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "25",
    src: "/20250503_114127.jpg",
    title: "Actividad IPA Xerez en la Yeguada del Hierro del Bocado y Cartuja de Jerez - Junio 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "26",
    src: "/20250927_102334.jpg",
    title: "Ruta del Rif - Actividad IPA Xerez - Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "27",
    src: "/20250927_105157.jpg",
    title: "Ruta del Rif - Actividad IPA Xerez - Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "28",
    src: "/20250927_144428.jpg",
    title: "Ruta del Rif - Actividad IPA Xerez - Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "29",
    src: "/20250927_103519.jpg",
    title: "Ruta del Rif - Actividad IPA Xerez - Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "30",
    src: "/20251206_182636.jpg",
    title: "Actividad IPA Xerez-Málaga - Diciembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "31",
    src: "/20251206_180716.jpg",
    title: "Actividad IPA Xerez-Málaga - Diciembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "32",
    src: "/20251206_180721.jpg",
    title: "Actividad IPA Xerez-Málaga - Diciembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "33",
    src: "/20251206_122144.jpg",
    title: "Actividad IPA Xerez-Málaga - Diciembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "34",
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/bpoqdsybtCqgdqhC.jpg",
    title: "Xegur-Arte - Encuentro de Coleccionismo Policial - Jerez Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "35",
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/wZoqrndwiPfQBmuS.jpg",
    title: "Xegur-Arte - Encuentro de Coleccionismo Policial - Jerez Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "36",
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/BMxPlRTKoKlXudng.jpg",
    title: "Xegur-Arte - Encuentro de Coleccionismo Policial - Jerez Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "37",
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/AUHBWPsGteykEkRa.jpg",
    title: "Xegur-Arte - Encuentro de Coleccionismo Policial - Jerez Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "38",
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/mzQJjVXiryJoyIYP.jpg",
    title: "Xegur-Arte - Encuentro de Coleccionismo Policial - Jerez Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "39",
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/wzvIhQNJqDDQxyex.jpg",
    title: "Xegur-Arte - Encuentro de Coleccionismo Policial - Jerez Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "40",
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/EElvjCrseBayKcCh.jpg",
    title: "Xegur-Arte - Encuentro de Coleccionismo Policial - Jerez Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "41",
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/unoUzljliOllsehF.jpg",
    title: "Xegur-Arte - Encuentro de Coleccionismo Policial - Jerez Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "42",
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/hxFDrjQPpeFekUxj.jpg",
    title: "Xegur-Arte - Encuentro de Coleccionismo Policial - Jerez Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "43",
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/ZCOLBZLeRFLowdjr.jpg",
    title: "Xegur-Arte - Encuentro de Coleccionismo Policial - Jerez Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "44",
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/BGcYvHHyqvBaYvZe.jpg",
    title: "Xegur-Arte - Encuentro de Coleccionismo Policial - Jerez Septiembre 2025",
    description: "",
    category: "eventos"
  },
  {
    id: "45",
    src: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/zUKhHBYVxdfIqTxn.jpg",
    title: "Xegur-Arte - Encuentro de Coleccionismo Policial - Jerez Septiembre 2025",
    description: "",
    category: "eventos"
  }
];

export default function Gallery() {
  const [, navigate] = useLocation();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "viajes" | "eventos" | "cultura">("all");
  const [isZoomed, setIsZoomed] = useState(false);

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
    setIsZoomed(false);
  };

  const goToNext = () => {
    if (currentIndex < GALLERY_IMAGES.length - 1) {
      setSelectedImage(GALLERY_IMAGES[currentIndex + 1]);
    } else {
      setSelectedImage(GALLERY_IMAGES[0]);
    }
    setIsZoomed(false);
  };

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, currentIndex]);

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

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs items={[{ label: "Galería", href: "/gallery" }]} />
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-r from-[#003366] to-[#004d99] text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <BackButton />
          </div>
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-5xl mb-4 font-bold">Galería de Fotos</h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">Momentos especiales de IPA Xerez: viajes internacionales, eventos y experiencias culturales que fortalecen nuestra hermandad.</p>
          </div>
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
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-fade-in {
              animation: fadeIn 0.2s ease-in-out;
            }
          `}</style>
          <div 
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              title="Cerrar (ESC)"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image Container */}
            <div className="relative bg-black rounded-lg overflow-hidden group">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title}
                className={`w-full h-auto max-h-[70vh] object-contain transition-transform duration-300 cursor-zoom-in ${
                  isZoomed ? "scale-150" : "scale-100"
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
              {/* Zoom Indicator */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                title={isZoomed ? "Deshacer zoom" : "Ampliar imagen"}
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Info */}
            <div className="mt-4 bg-white rounded-lg p-6">
              <h2 className="font-heading text-2xl text-[#003366] mb-2 font-bold">{selectedImage.title}</h2>
              <p className="text-gray-700 text-lg mb-4">{selectedImage.description}</p>
              
              {/* Share Buttons */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-3 font-semibold">Compartir en redes sociales:</p>
                <div className="flex gap-2 flex-wrap">
                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/gallery&quote=${encodeURIComponent(selectedImage.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-all duration-300 hover:scale-110"
                    title="Compartir en Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  
                  {/* Twitter/X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedImage.title)}&url=${window.location.origin}/gallery`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black hover:bg-gray-800 text-white rounded-full p-2 transition-all duration-300 hover:scale-110"
                    title="Compartir en Twitter/X"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.694-5.829 6.694h-3.328l7.701-8.835L.424 2.25h6.679l4.882 6.268L17.14 2.25h.104zm-1.106 17.611h1.828L5.31 3.712H3.424l13.82 16.149z"/>
                    </svg>
                  </a>
                  
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(selectedImage.title + ' - Mira esta foto de IPA Xerez: ' + window.location.origin + '/gallery')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition-all duration-300 hover:scale-110"
                    title="Compartir en WhatsApp"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.37 1.237-3.285 2.152-1.81 1.81-2.834 4.158-2.834 6.664 0 2.506 1.023 4.854 2.834 6.664 1.81 1.81 4.158 2.834 6.664 2.834 2.506 0 4.854-1.023 6.664-2.834 1.81-1.81 2.834-4.158 2.834-6.664 0-2.506-1.023-4.854-2.834-6.664-1.81-1.81-4.158-2.834-6.664-2.834z"/>
                    </svg>
                  </a>
                  
                  {/* Instagram */}
                  <a
                    href="https://instagram.com/ipa_xerez"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white rounded-full p-2 transition-all duration-300 hover:scale-110"
                    title="Seguir en Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
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
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 text-white hover:text-gray-300 hover:scale-125 transition-all duration-300"
              title="Anterior (← Flecha izquierda)"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 text-white hover:text-gray-300 hover:scale-125 transition-all duration-300"
              title="Siguiente (→ Flecha derecha)"
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            {/* Keyboard Hints */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-white/60 text-xs text-center whitespace-nowrap">
              <p>Usa ← → para navegar • ESC para cerrar • Click para ampliar</p>
            </div>
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
