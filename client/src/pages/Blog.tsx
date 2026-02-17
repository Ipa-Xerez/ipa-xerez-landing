import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, User, Tag, ChevronRight, LogIn } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Blog() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "oldest">("recent");
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  // Obtener todos los posts
  const { data: allPosts = [], isLoading } = trpc.blog.getAll.useQuery();

  // Extraer categorías únicas
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allPosts.forEach((post) => {
      if (post.category) cats.add(post.category);
    });
    return Array.from(cats).sort();
  }, [allPosts]);

  // Filtrar y buscar posts
  const filteredPosts = useMemo(() => {
    let filtered = allPosts;

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query)
      );
    }

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Ordenar
    if (sortBy === "oldest") {
      filtered.sort(
        (a, b) =>
          new Date(a.publishedAt || a.createdAt).getTime() -
          new Date(b.publishedAt || b.createdAt).getTime()
      );
    } else {
      filtered.sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime()
      );
    }

    return filtered;
  }, [allPosts, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/")}
            >
              ← Volver
            </Button>
            <div className="flex gap-3">
              <Button 
                className="bg-yellow-500 text-gray-900 hover:bg-yellow-600 font-bold"
                onClick={() => window.location.href = "mailto:ipaagrupacionxerez@gmail.com"}
              >
                📧 Enviar Historia
              </Button>
              <Button 
                className="bg-transparent hover:bg-white/10 p-2 rounded-lg transition-all duration-200" 
                onClick={() => window.location.href = getLoginUrl('/admin/blog')}
                title="Panel de Administración"
              >
                <img src="/favicon-192.png" alt="Admin" className="h-6 w-6" />
              </Button>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">📰 Blog IPA Xerez</h1>
          <p className="text-xl text-blue-100">
            Noticias, artículos y actualizaciones de la International Police Association
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar posts por título, contenido..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 text-lg"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Categorías:</span>
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === null
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Todas
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "recent" | "oldest")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 cursor-pointer"
              >
                <option value="recent">Más recientes</option>
                <option value="oldest">Más antiguos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-8">
          <p className="text-gray-600">
            {isLoading ? (
              "Cargando posts..."
            ) : filteredPosts.length === 0 ? (
              <span>
                No se encontraron posts
                {searchQuery && ` con "${searchQuery}"`}
                {selectedCategory && ` en la categoría "${selectedCategory}"`}
              </span>
            ) : (
              <span>
                Mostrando <strong>{filteredPosts.length}</strong> de{" "}
                <strong>{allPosts.length}</strong> posts
              </span>
            )}
          </p>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-lg h-96 animate-pulse"
              />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No hay posts disponibles
            </h3>
            <p className="text-gray-600">
              Intenta cambiar los filtros o la búsqueda
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col h-full"
              >
                {/* Featured Image */}
                {post.image && (
                  <div className="h-48 bg-gray-300 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Category Badge */}
                  {post.category && (
                    <div className="mb-3">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta Information */}
                  <div className="space-y-2 text-sm text-gray-500 mb-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(
                          post.publishedAt || post.createdAt
                        ).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {post.author && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                    )}
                    {post.tags && JSON.parse(post.tags || "[]").length > 0 && (
                      <div className="flex items-start gap-2">
                        <Tag className="h-4 w-4 mt-0.5" />
                        <div className="flex flex-wrap gap-1">
                          {JSON.parse(post.tags || "[]").map(
                            (tag: string, i: number) => (
                              <span
                                key={i}
                                className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs"
                              >
                                {tag}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Read More Button */}
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    Leer más <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && allPosts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📝</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Blog en construcción
            </h2>
            <p className="text-gray-600 text-lg">
              Pronto compartiremos artículos interesantes sobre IPA Xerez
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}


      {/* Post Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-3xl w-full my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 md:p-8 sticky top-0 z-10">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  {selectedPost.category && (
                    <div className="mb-3">
                      <span className="bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-xs font-bold">
                        {selectedPost.category}
                      </span>
                    </div>
                  )}
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {selectedPost.title}
                  </h1>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-white hover:text-gray-300 transition-colors text-3xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                {selectedPost.author && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{selectedPost.author}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(
                      selectedPost.publishedAt || selectedPost.createdAt
                    ).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Featured Image */}
              {selectedPost.image && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Article Body */}
              <div className="prose prose-sm md:prose-base max-w-none">
                <div className="text-gray-700 leading-relaxed space-y-4 whitespace-pre-wrap">
                  {selectedPost.content}
                </div>
              </div>

              {/* Tags */}
              {selectedPost.tags && JSON.parse(selectedPost.tags || "[]").length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(selectedPost.tags || "[]").map(
                      (tag: string, i: number) => (
                        <span
                          key={i}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
