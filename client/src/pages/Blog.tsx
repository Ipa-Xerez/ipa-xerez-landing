import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, User, Share2, Search, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: number;
}

const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: "1",
    title: "IPA Xerez: Los Primeros Pasos de una Agrupación con Propósito",
    excerpt: "Desde nuestra fundación en abril de 2025, IPA Xerez ha trabajado sin parar para consolidar una comunidad de hermandad y profesionalismo. Aquí te contamos cómo comenzó todo.",
    content: `IPA Xerez: Los Primeros Pasos de una Agrupación con Propósito

Hace apenas unos meses que IPA Xerez se convirtió en una realidad oficial. Pero la verdad es que todo comenzó mucho antes, con la ilusión de un grupo de compañeros que creían que Jerez merecía tener su propia agrupación de la International Police Association.

El 12 de marzo de 2025 fue el día en que todo se hizo oficial. IPA Xerez pasó a formar parte de la Sección Española de IPA. No fue solo un trámite administrativo, sino el resultado del esfuerzo, la confianza y el apoyo de muchos compañeros que creyeron en este proyecto desde el principio.

Desde ese momento, nos propusimos llevar el espíritu de "Servo per Amikeco" (Servicio a través de la Amistad) a lo más alto. Y la verdad es que no nos hemos detenido.

## Nuestro Primer Evento: Un Día para Recordar

El 3 de mayo vivimos lo que muchos de nosotros consideramos el verdadero inicio de IPA Xerez como agrupación activa. Organizamos nuestra primera actividad oficial: una jornada que combinaba historia, tradición y, sobre todo, compañerismo.

Visitamos la Yeguada del Hierro del Bocado, ese lugar emblemático de Jerez donde la tradición ecuestre sigue viva. Compartimos un almuerzo cartujano (gracias a Josemi Cantos por el catering) y disfrutamos de una visita guiada al Monasterio de la Cartuja.

Lo más especial fue ver a compañeros llegando desde Madrid, Barcelona, Málaga y, por supuesto, desde Jerez. IPA no entiende de distancias cuando se trata de compartir. Fue un día inolvidable que marcó el inicio de muchas experiencias por venir.

## Crecimiento y Reconocimiento

Desde entonces, no hemos parado. En mayo ya teníamos cifras que nos hacían sentir orgullosos:

- Más de 50 publicaciones en nuestras redes
- 77.000 visualizaciones en TikTok (¡con nuestro vídeo de consejos de seguridad durante la Feria!)
- 600 seguidores combinados en Instagram y Facebook
- Representación de 5 provincias en nuestras actividades
- Más de 100 personas participando presencialmente

Pero los números no lo dicen todo. Lo importante fue el ambiente que creamos: risas, reencuentros, nuevas amistades y el orgullo compartido de pertenecer a IPA.

## Reconocimiento a Quienes Merecen Serlo

También quisimos honrar a personas especiales. Fabiola Serrano, Policía Local jubilada y fundadora de Escudos Solidarios (que ha recaudado más de 50.000 € para niños con cáncer), se convirtió en nuestra primera Socia de Honor. Su ejemplo de entrega encarna perfectamente los valores de IPA.

Después llegó Francisco Javier Zuasti, activista y ejemplo de superación constante. Con una discapacidad del 90%, Fran ha hecho de la accesibilidad una causa de vida. Desde IPA Xerez quisimos reconocer su compromiso activo con la inclusión, la igualdad y la justicia.

## Mirando Hacia Adelante

Estos primeros meses nos han enseñado algo importante: cuando nos juntamos con espíritu de servicio, el resultado es inolvidable. No se trata solo de actividades o números. Se trata de crear conexiones reales entre compañeros de distintas ciudades, de diferentes cuerpos y fuerzas de seguridad, unidos por un propósito común.

IPA Xerez seguirá creciendo. Seguiremos organizando actividades, formando, colaborando y, sobre todo, fomentando esa hermandad que nos define.

Porque al final, eso es lo que significa "Servo per Amikeco": servicio a través de la amistad. Y eso es lo que somos.

Bienvenido a la familia IPA Xerez.`,
    author: "IPA Xerez",
    date: "3 de Mayo de 2025",
    category: "Historia",
    readTime: 6
  },
  {
    id: "2",
    title: "Diversidad, Inclusión y Hermandad: Lo que Vivimos en la Feria de Jerez",
    excerpt: "Durante la Feria del Caballo 2025, IPA Xerez celebró la diversidad cultural y demostró que nuestros valores trascienden fronteras. Aquí te contamos cómo.",
    content: `Diversidad, Inclusión y Hermandad: Lo que Vivimos en la Feria de Jerez

La Feria del Caballo de Jerez siempre es especial. Pero este año, para IPA Xerez, fue mucho más que eso.

El 21 de mayo, en pleno corazón de la Feria, conmemoramos el Día Mundial de la Diversidad Cultural para el Diálogo y el Desarrollo. Además, la Feria de este año fue dedicada al Pueblo Gitano, reconociendo su profunda aportación a la cultura, el arte y la identidad jerezana. Un homenaje merecido que refuerza la importancia de la inclusión y el respeto.

Desde IPA Xerez quisimos unirnos a esta conmemoración con orgullo y compromiso.

## Más Allá de las Casetas

Cuando hablamos de diversidad, no es solo un concepto bonito en un boletín. Es vivirlo. Durante la semana de feria, en cada caseta donde estuvimos presentes, hubo espacio para compartir miradas, idiomas, culturas, risas y muchas historias.

Cada caseta fue un espacio de convivencia. Cada brindis, una bienvenida. Y en todas esas historias estuvo presente ese espíritu IPA que no entiende de fronteras.

## El Trabajo de Nuestros Compañeros

No podemos olvidar la gran labor de la Policía Local y Nacional durante la Feria. Ellos fueron los verdaderos protagonistas, garantizando la seguridad y permitiendo que todos disfrutáramos.

De hecho, nuestro vídeo con consejos de seguridad durante la Feria superó las 77.000 visualizaciones en TikTok. Porque la seguridad también puede ser cercana, accesible y, por qué no, divertida.

## Un Mensaje Más Allá de la Feria

Lo que vivimos durante esos días en la Feria de Jerez es un reflejo de lo que IPA Xerez quiere ser: un espacio donde la diversidad no solo se respeta, sino que se vive y se celebra.

Porque la hermandad policial internacional no es un lema bonito. Es una realidad que construimos cada día, en cada encuentro, en cada momento que compartimos.

Gracias a Jerez por enseñarnos, una vez más, que la alegría también es diversidad.

#DiversidadCultural #FeriaDeJerez2025 #IPAporlaPaz #ServoPerAmikeco`,
    author: "IPA Xerez",
    date: "21 de Mayo de 2025",
    category: "Eventos",
    readTime: 5
  }
];

export default function Blog() {
  const [, navigate] = useLocation();
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = BLOG_ARTICLES.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="font-display text-4xl md:text-5xl mb-4 font-bold">Blog de IPA Xerez</h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">Historias, experiencias y reflexiones sobre la hermandad policial internacional desde la perspectiva de nuestra comunidad.</p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          {filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white border border-gray-200"
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#003366] to-[#004d99] h-48 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-5xl mb-2">📰</div>
                      <p className="text-sm font-semibold">{article.category}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-lg text-[#003366] font-semibold mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{article.date}</span>
                      </div>
                      <span className="text-[#003366] font-semibold">{article.readTime} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No se encontraron artículos que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>
      </section>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#003366] to-[#004d99] text-white p-6 md:p-8 sticky top-0 z-10">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#D4AF37] text-[#003366] px-3 py-1 rounded-full text-xs font-bold">
                      {selectedArticle.category}
                    </span>
                    <span className="text-gray-200 text-sm">{selectedArticle.readTime} min de lectura</span>
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold">{selectedArticle.title}</h1>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-white hover:text-gray-300 transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{selectedArticle.author}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{selectedArticle.date}</span>
                </div>
              </div>

              {/* Article Body */}
              <div className="prose prose-sm md:prose-base max-w-none mb-8">
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {selectedArticle.content.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('#')) {
                      const level = paragraph.match(/^#+/)[0].length;
                      const text = paragraph.replace(/^#+\s/, '');
                      if (level === 1) return <h1 key={idx} className="text-3xl font-bold text-[#003366] mt-6 mb-4">{text}</h1>;
                      if (level === 2) return <h2 key={idx} className="text-2xl font-bold text-[#003366] mt-5 mb-3">{text}</h2>;
                      if (level === 3) return <h3 key={idx} className="text-xl font-bold text-[#003366] mt-4 mb-2">{text}</h3>;
                    }
                    if (paragraph.startsWith('-')) {
                      return (
                        <ul key={idx} className="list-disc list-inside space-y-2 text-gray-700">
                          {paragraph.split('\n').map((item, i) => (
                            <li key={i}>{item.replace(/^-\s/, '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={idx} className="text-gray-700">{paragraph}</p>;
                  })}
                </div>
              </div>

              {/* Share Buttons */}
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-600 mb-3 font-semibold">Compartir artículo:</p>
                <div className="flex gap-2 flex-wrap">
                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/blog&quote=${encodeURIComponent(selectedArticle.title)}`}
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
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedArticle.title)}&url=${window.location.origin}/blog`}
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
                    href={`https://wa.me/?text=${encodeURIComponent(selectedArticle.title + ' - Lee este artículo en el Blog de IPA Xerez: ' + window.location.origin + '/blog')}`}
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
            </div>

            {/* Close Button */}
            <div className="bg-gray-50 px-6 md:px-8 py-4 border-t border-gray-200 flex justify-end">
              <Button
                onClick={() => setSelectedArticle(null)}
                className="bg-[#003366] text-white hover:bg-[#1A3A52]"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
