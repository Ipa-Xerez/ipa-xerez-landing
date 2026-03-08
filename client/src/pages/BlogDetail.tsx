import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, User } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function BlogDetail() {
  const [location, navigate] = useLocation();
  const slug = location.split("/blog/")[1];

  const { data: posts = [] } = trpc.blog.getAll.useQuery();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className="text-[#003366] hover:bg-[#F5F5F5] mb-8"
            onClick={() => navigate("/blog")}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Volver al Blog
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-[#003366] mb-4">
              Artículo no encontrado
            </h1>
            <p className="text-gray-600">
              El artículo que buscas no existe o ha sido eliminado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#F5F5F5] border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            className="text-[#003366] hover:bg-white mb-4"
            onClick={() => navigate("/blog")}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Volver al Blog
          </Button>
          <h1 className="font-display text-4xl md:text-5xl text-[#003366] font-bold">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-6 mt-4 text-gray-600">
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            )}
            {post.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Image */}
          {post.image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-700 mb-8 italic border-l-4 border-[#D4AF37] pl-4">
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div
              className="text-gray-700 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {post.tags.split(",").map((tag) => (
                  <span
                    key={tag.trim()}
                    className="inline-block bg-[#F5F5F5] text-[#003366] px-3 py-1 rounded-full text-sm"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back button */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Button
              className="bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F]"
              onClick={() => navigate("/blog")}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver al Blog
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
