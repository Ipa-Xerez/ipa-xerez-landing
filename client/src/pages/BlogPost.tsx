import { useRoute } from "wouter";
import { trpc } from "../lib/trpc";
import { useLocation } from "wouter";
import { ArrowLeft, Calendar, User, Share2, Check } from "lucide-react";
import { useState } from "react";

function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (_) {
        // El usuario canceló o no está disponible
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      // fallback: seleccionar texto
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
        <Share2 className="w-4 h-4" />
        Compartir este artículo
      </p>
      <div className="flex flex-wrap gap-3">
        {/* WhatsApp */}
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 shadow-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.37 1.237-3.285 2.152-1.81 1.81-2.834 4.158-2.834 6.664 0 2.506 1.023 4.854 2.834 6.664 1.81 1.81 4.158 2.834 6.664 2.834 2.506 0 4.854-1.023 6.664-2.834 1.81-1.81 2.834-4.158 2.834-6.664 0-2.506-1.023-4.854-2.834-6.664-1.81-1.81-4.158-2.834-6.664-2.834z" />
          </svg>
          WhatsApp
        </a>

        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#0d6de0] text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 shadow-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </a>

        {/* Twitter / X */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 shadow-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X (Twitter)
        </a>

        {/* Botón nativo (solo si navigator.share está disponible) */}
        {typeof navigator !== "undefined" && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-2 bg-[#003366] hover:bg-[#002244] text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            Compartir
          </button>
        )}

        {/* Copiar enlace */}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-600">¡Copiado!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar enlace
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function BlogPost() {
  const [match, params] = useRoute("/blog/:id");
  const [, navigate] = useLocation();

  // El parámetro puede ser un slug (texto) o un ID numérico (legado)
  const idParam = params?.id || "";
  const isNumericId = /^\d+$/.test(idParam);

  // Si es numérico, buscamos por ID; si no, buscamos por slug
  const byIdQuery = trpc.blog.getById.useQuery(
    { id: parseInt(idParam) },
    { enabled: isNumericId }
  );
  const bySlugQuery = trpc.blog.getBySlug.useQuery(
    { slug: idParam },
    { enabled: !isNumericId }
  );

  const isLoading = isNumericId ? byIdQuery.isLoading : bySlugQuery.isLoading;
  const post = isNumericId ? byIdQuery.data : bySlugQuery.data;

  // URL canónica del artículo para compartir
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/blog/${post?.slug || idParam}`
    : "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-[#003366] mb-4">Artículo no encontrado</h2>
          <p className="text-gray-600 mb-6">El artículo que buscas no existe o ha sido eliminado.</p>
          <button
            onClick={() => navigate("/blog")}
            className="bg-[#003366] text-white px-6 py-3 rounded-lg hover:bg-[#002244] transition-colors"
          >
            Volver al Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar simple */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#003366] hover:text-[#002244] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => navigate("/blog")}
            className="text-[#003366] hover:text-[#002244] font-medium transition-colors"
          >
            Blog
          </button>
        </div>
      </nav>

      {/* Imagen de cabecera */}
      {post.image && (
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Contenido */}
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {post.category && (
          <span className="inline-block bg-[#003366] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            {post.category}
          </span>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-gray-500 text-sm mb-6 pb-6 border-b border-gray-200">
          {post.author && (
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </span>
          )}
          {post.createdAt && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.createdAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>

        {post.excerpt && (
          <p className="text-lg text-gray-600 italic mb-6 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>

        {/* Botones de compartir */}
        <ShareButtons title={post.title} url={shareUrl} />

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-[#003366] hover:text-[#002244] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Blog
          </button>
        </div>
      </div>
    </div>
  );
}
