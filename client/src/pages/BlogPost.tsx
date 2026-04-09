import { useRoute } from "wouter";
import { trpc } from "../lib/trpc";
import { useLocation } from "wouter";
import { ArrowLeft, Calendar, User } from "lucide-react";

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

        <div className="mt-12 pt-8 border-t border-gray-200">
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
