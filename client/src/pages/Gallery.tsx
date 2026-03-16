import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useLocation } from "wouter";
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";

interface GallerySection {
  id: number;
  name: string;
  images: Array<{
    id: number;
    title: string;
    imageUrl: string;
  }>;
}

export default function Gallery() {
  const [, navigate] = useLocation();
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [sections, setSections] = useState<GallerySection[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch gallery data from API
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/trpc/gallery.getAll");
        const data = await response.json();
        
        let images = [];
        if (data.result && data.result.data && data.result.data.json && Array.isArray(data.result.data.json)) {
          images = data.result.data.json;
        } else if (data.result && Array.isArray(data.result)) {
          images = data.result;
        } else if (data.result && data.result.data && Array.isArray(data.result.data)) {
          images = data.result.data;
        }
        
        if (images.length > 0) {
          const grouped: { [key: number]: GallerySection } = {};
          
          images.forEach((item: any) => {
            if (!grouped[item.categoryId]) {
              grouped[item.categoryId] = {
                id: item.categoryId,
                name: item.categoryName || "Sin categoría",
                images: []
              };
            }
            grouped[item.categoryId].images.push({
              id: item.id,
              title: item.title,
              imageUrl: item.imageUrl
            });
          });
          
          setSections(Object.values(grouped));
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const allImages = sections.flatMap(s => s.images);
  const currentIndex = selectedImage ? allImages.findIndex(img => img.id === selectedImage.id) : -1;

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setSelectedImage(allImages[currentIndex - 1]);
    } else {
      setSelectedImage(allImages[allImages.length - 1]);
    }
    setIsZoomed(false);
  };

  const goToNext = () => {
    if (currentIndex < allImages.length - 1) {
      setSelectedImage(allImages[currentIndex + 1]);
    } else {
      setSelectedImage(allImages[0]);
    }
    setIsZoomed(false);
  };

  // Keyboard navigation
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
  }, [selectedImage, currentIndex, allImages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando galería...</p>
        </div>
      </div>
    );
  }

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

      {/* Gallery Grid - Sections with Cover Images */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section) => (
              <div 
                key={section.id}
                className="group cursor-pointer"
                onClick={() => setSelectedSectionId(section.id)}
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="relative overflow-hidden bg-gray-200 aspect-square">
                    {section.images.length > 0 && (
                      <img 
                        src={section.images[0].imageUrl} 
                        alt={section.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                        <div className="text-white text-lg font-semibold mb-2">
                          {section.images.length} foto{section.images.length !== 1 ? 's' : ''}
                        </div>
                        <svg className="w-12 h-12 text-white mx-auto" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-heading text-lg text-[#003366] font-semibold">{section.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{section.images.length} foto{section.images.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Detail Modal */}
      {selectedSectionId !== null && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex flex-col p-4"
          onClick={() => setSelectedSectionId(null)}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-2xl font-bold">
              {sections.find(s => s.id === selectedSectionId)?.name}
            </h2>
            <button
              onClick={() => setSelectedSectionId(null)}
              className="text-white hover:text-gray-300 transition-colors"
              title="Cerrar"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
          
          <div 
            className="flex-1 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {sections.find(s => s.id === selectedSectionId)?.images.map((image) => (
                <div 
                  key={image.id}
                  className="group cursor-pointer rounded-lg overflow-hidden"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative overflow-hidden bg-gray-200 aspect-square">
                    <img 
                      src={image.imageUrl} 
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ZoomIn className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
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
                src={selectedImage.imageUrl} 
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

              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                title="Anterior (←)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                title="Siguiente (→)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Image Info */}
            <div className="text-white text-center mt-4">
              <p className="text-sm text-gray-300">{currentIndex + 1} de {allImages.length}</p>
              <p className="text-lg font-semibold mt-2">{selectedImage.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
