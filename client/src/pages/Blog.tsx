import { useLocation } from "wouter";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function Blog() {
  const [, navigate] = useLocation();

  const blogPosts = [
    {
      id: 1,
      title: "Artículo 1",
      excerpt: "Contenido próximamente...",
      date: "Próximamente",
      author: "IPA Xerez",
    },
    {
      id: 2,
      title: "Artículo 2",
      excerpt: "Contenido próximamente...",
      date: "Próximamente",
      author: "IPA Xerez",
    },
    {
      id: 3,
      title: "Artículo 3",
      excerpt: "Contenido próximamente...",
      date: "Próximamente",
      author: "IPA Xerez",
    },
  ];

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
          <h2 className="font-heading text-4xl text-[#003366] mb-4">Blog de IPA Xerez</h2>
          <p className="text-gray-600 text-lg">
            Noticias, artículos y actualizaciones sobre nuestras actividades
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <p className="text-gray-500">Imagen del artículo</p>
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl text-[#003366] mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                </div>
                <button className="text-[#D4AF37] hover:text-[#003366] font-semibold transition-colors">
                  Leer más →
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">
            El blog está listo para ser completado con tus artículos y noticias.
          </p>
          <p className="text-sm text-gray-500">
            Próximamente: Publica artículos sobre eventos, intercambios, noticias y actualizaciones de IPA Xerez
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
                <li><button onClick={() => navigate("/gallery")} className="hover:text-[#D4AF37]">Galería</button></li>
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
