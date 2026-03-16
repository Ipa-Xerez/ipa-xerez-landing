import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, ZoomIn, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";

interface GalleryImage {
  id: number;
  src: string;
  title: string;
  description: string;
  categoryId: number;
}

export default function Gallery() {
  const [, navigate] = useLocation();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">("all");
  const [isZoomed, setIsZoomed] = useState(false);

  // Fetch categories and images from tRPC
  const { data: categories, isLoading: isLoadingCategories } = trpc.gallery.getCategories.useQuery();
  const { data: images, isLoading: isLoadingImages } = trpc.gallery.getImages.useQuery();

  const galleryImages: GalleryImage[] = images?.map(img => ({
    id: img.id,
    src: img.imageUrl,
    title: img.title,
    description: img.description || "",
    categoryId: img.categoryId
  })) || [];

  const filteredImages = selectedCategoryId === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.categoryId === selectedCategoryId);

  const currentIndex = selectedImage ? galleryImages.findIndex(img => img.id === selectedImage.id) : -1;

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setSelectedImage(galleryImages[currentIndex - 1]);
    } else {
      setSelectedImage(galleryImages[galleryImages.length - 1]);
    }
    setIsZoomed(false);
  };

  const goToNext = () => {
    if (currentIndex < galleryImages.length - 1) {
      setSelectedImage(galleryImages[currentIndex + 1]);
    } else {
      setSelectedImage(galleryImages[0]);
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
  }, [selectedImage, currentIndex, galleryImages]);

  if (isLoadingCategories || isLoadingImages) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#003366] animate-spin mx-auto mb-4" />
          <p className="text-[#003366] font-semibold">Cargando galería...</p>
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

      {/* Filter Buttons */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              onClick={() => setSelectedCategoryId("all")}
              className={`${selectedCategoryId === "all" ? "bg-[#003366] text-white" : "bg-white text-[#003366] border border-[#003366]"} hover:bg-[#003366] hover:text-white transition-colors`}
            >
              Todas las Fotos
            </Button>
            {categories?.map(category => (
              <Button 
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`${selectedCategoryId === category.id ? "bg-[#003366] text-white" : "bg-white text-[#003366] border border-[#003366]"} hover:bg-[#003366] hover:text-white transition-colors`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          {filteredImages.length > 0 ? (
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
                        <ZoomIn className="w-12 h-12 text-white" />
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay imágenes disponibles en esta categoría.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
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

            {/* Navigation Buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-[-60px] top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors hidden md:block"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-[-60px] top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors hidden md:block"
            >
              <ChevronRight className="w-12 h-12" />
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
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Info */}
            <div className="mt-4 bg-white rounded-lg p-6">
              <h2 className="font-heading text-2xl text-[#003366] mb-2 font-bold">{selectedImage.title}</h2>
              <p className="text-gray-700 text-lg">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
