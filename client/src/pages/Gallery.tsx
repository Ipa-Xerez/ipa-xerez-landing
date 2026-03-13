import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Share2, ZoomIn } from "lucide-react";
import { useLocation } from "wouter";
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";

interface GalleryImage {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  categoryId: number;
}

interface GalleryCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export default function Gallery() {
  const [, navigate] = useLocation();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"all" | number>("all");
  const [isZoomed, setIsZoomed] = useState(false);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);

  // Fetch categories using tRPC
  const { data: categoriesData = [], isLoading: categoriesLoading, error: categoriesError } = trpc.gallery.getCategories.useQuery();

  const categories: GalleryCategory[] = categoriesData || [];

  // Fetch all images using tRPC
  const { data: imagesData = [], isLoading: imagesLoading } = trpc.gallery.getAllImages.useQuery();
  
  useEffect(() => {
    if (imagesData && Array.isArray(imagesData) && imagesData.length > 0) {
      // Solo actualizar si realmente hay datos nuevos
      setAllImages(prev => {
        if (prev.length === imagesData.length && prev[0]?.id === imagesData[0]?.id) {
          return prev; // No cambiar si es el mismo contenido
        }
        return imagesData;
      });
    }
  }, [imagesData.length]); // Solo depender de la longitud para evitar loops

  // Función para obtener URL proxy de imagen
  const getImageUrl = (originalUrl: string) => {
    return `/api/gallery/image-proxy?url=${encodeURIComponent(originalUrl)}`;
  };

  const filteredImages = selectedCategory === "all" 
    ? allImages 
    : allImages.filter(img => img.categoryId === selectedCategory);

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
  }, [selectedImage, currentIndex]);

  const isLoading = categoriesLoading || imagesLoading;
  const error = categoriesError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] mx-auto mb-4"></div>
          <p className="text-[#003366]">Cargando galería...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
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
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-red-600 text-lg">{error?.message || "Error al cargar la galería"}</p>
          <Button className="mt-4 bg-[#003366] text-white hover:bg-[#002244]" onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
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
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#003366] mb-8">Galería de Fotos</h1>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            className={selectedCategory === "all" ? "bg-[#003366] text-white" : "text-[#003366] border-[#003366]"}
            onClick={() => setSelectedCategory("all")}
          >
            Todas las categorías
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={selectedCategory === category.id ? "bg-[#003366] text-white" : "text-[#003366] border-[#003366]"}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay imágenes en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map(image => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition hover:scale-105"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={getImageUrl(image.imageUrl)}
                  alt={image.title}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23ccc%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-family=%22Arial%22 font-size=%2216%22%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-end p-4">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition">
                    <p className="font-semibold">{image.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de imagen ampliada */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-50 bg-white text-black rounded-full p-2 hover:bg-gray-200 transition"
            >
              <X size={24} />
            </button>

            {/* Image container */}
            <div className="relative w-full max-w-4xl">
              <img
                src={getImageUrl(selectedImage.imageUrl)}
                alt={selectedImage.title}
                className={`w-full h-auto ${isZoomed ? "max-h-none" : "max-h-[80vh]"} object-contain transition-transform`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22%3E%3Crect fill=%22%23ccc%22 width=%22600%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-family=%22Arial%22 font-size=%2220%22%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>

            {/* Navigation buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-2 hover:bg-gray-200 transition"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-2 hover:bg-gray-200 transition"
            >
              <ChevronRight size={32} />
            </button>

            {/* Image info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded">
              <h3 className="font-semibold text-lg">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-sm text-gray-300 mt-2">{selectedImage.description}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {currentIndex + 1} de {allImages.length}
              </p>
            </div>

            {/* Action buttons */}
            <div className="absolute top-4 left-4 flex gap-2">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="bg-white text-black rounded-full p-2 hover:bg-gray-200 transition"
                title="Zoom"
              >
                <ZoomIn size={20} />
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: selectedImage.title,
                      url: selectedImage.imageUrl,
                    });
                  }
                }}
                className="bg-white text-black rounded-full p-2 hover:bg-gray-200 transition"
                title="Compartir"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
