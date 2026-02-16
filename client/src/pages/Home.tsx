import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Calendar, Gift, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import InstagramFeed from "@/components/InstagramFeed";

const HERO_IMAGE = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/EGzPdIJIBsAxVVTe.jpg";
const SERVICE1 = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/oKUdbvDdBdpitULq.png";
const SERVICE2 = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/WQBgFGwdKVZpShDj.png";
const SERVICE3 = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/jjIqOiRseMIWAcLH.png";
const SERVICE4 = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/kdNKnNyCPISnehMP.png";
const POLICE_WEEK_POSTER = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/bspODVNHZxCvOkZg.PNG";
const INSCRIPTION_FORM = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/ISIAsxyZJpDNPGZY.pdf";

export default function Home() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success">("idle");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success">("idle");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showInscriptionModal, setShowInscriptionModal] = useState(false);

  const faqs = [
    { q: "¿Cómo me uno a IPA Xerez?", a: "Puedes unirte completando el formulario de contacto o enviándonos un mensaje por WhatsApp. Te guiaremos en todo el proceso de membresía." },
    { q: "¿Cuál es el costo de la membresía?", a: "Los costos de membresía varían según el tipo. Contáctanos para recibir información detallada sobre las opciones disponibles." },
    { q: "¿Cuáles son los beneficios de ser miembro?", a: "Acceso a descuentos exclusivos, red global de 140+ países, eventos internacionales, formación continua y mucha más camaradería." },
    { q: "¿Puedo participar en los intercambios internacionales?", a: "Sí, todos nuestros miembros pueden participar en viajes e intercambios. Organizamos eventos en Marruecos, Portugal y otros países." },
    { q: "¿Hay eventos locales en Jerez?", a: "Sí, organizamos eventos culturales como las Zambombas, visitas a la Yeguada y reuniones mensuales de camaradería." },
    { q: "¿Necesito ser policía en activo?", a: "No, también aceptamos policías jubilados y personal de seguridad. IPA es para todos los que compartan nuestros valores." }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");
    setTimeout(() => {
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/AgkWeOTDyZirPRUK.png" alt="IPA Xerez" className="h-12 w-auto" />
            <span className="font-heading text-[#003366] text-xl hidden sm:inline">IPA Xerez</span>
          </div>
          <div className="flex gap-4 items-center">
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5]" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Inicio</Button>
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5]" onClick={() => document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' })}>Beneficios</Button>
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5]" onClick={() => navigate('/gallery')}>Galería</Button>
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5]" onClick={() => navigate('/blog')}>Blog</Button>
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5]" onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}>FAQ</Button>
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5]" onClick={() => document.getElementById('eventos')?.scrollIntoView({ behavior: 'smooth' })}>Próximos Eventos</Button>
            <Button className="bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F]" onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}>Unete Ahora</Button>
            <a href="https://www.facebook.com/profile.php?id=61572445883496" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-all duration-300 hover:scale-110" title="Síguenos en Facebook"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
            <a href="https://www.tiktok.com/@ipa.xerez" target="_blank" rel="noopener noreferrer" className="bg-black hover:bg-gray-800 text-white rounded-full p-2 transition-all duration-300 hover:scale-110" title="Síguenos en TikTok"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.89 2.89 0 0 1 2.31-4.64 2.86 2.86 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.54-.05z"/></svg></a>
            <a href="https://instagram.com/ipa_xerez" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white rounded-full p-2 transition-all duration-300 hover:scale-110" title="Síguenos en Instagram"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/></svg></a>
            <a href="https://wa.me/34675508110" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition-all duration-300 hover:scale-110" title="Contactanos por WhatsApp"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.37 1.237-3.285 2.152-1.81 1.81-2.834 4.158-2.834 6.664 0 2.506 1.023 4.854 2.834 6.664 1.81 1.81 4.158 2.834 6.664 2.834 2.506 0 4.854-1.023 6.664-2.834 1.81-1.81 2.834-4.158 2.834-6.664 0-2.506-1.023-4.854-2.834-6.664-1.81-1.81-4.158-2.834-6.664-2.834z" /></svg></a>
          </div>
        </div>
      </nav>

      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70"></div>
        </div>
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div className="max-w-3xl mx-auto px-4">
            <div className="mb-6 inline-block">
              <div className="bg-[#D4AF37]/20 border border-[#D4AF37] rounded-full px-6 py-2 text-[#D4AF37] text-sm font-semibold backdrop-blur-sm">
                ✨ Desde 1950 | 140+ Países | Servo per Amikeco
              </div>
            </div>
            <h1 className="font-display text-5xl md:text-7xl mb-6 leading-tight font-bold drop-shadow-lg">Amistad y Profesionalidad sin Fronteras</h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-50 drop-shadow-md">Únete a la mayor red mundial de policías bajo nuestro lema de hermandad internacional</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button className="bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700] text-lg px-10 py-7 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" onClick={() => setShowInscriptionModal(true)}>Hazte Socio Ahora</Button>
              <Button variant="outline" className="text-white border-2 border-white hover:bg-white/20 text-lg px-10 py-7 font-bold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm" onClick={() => window.open('https://ipa-international.org/about', '_blank')}>Más Información</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl text-[#003366] mb-6">Nuestra Historia</h2>
            <p className="text-lg text-gray-700 leading-relaxed">La International Police Association (IPA) es una organizacion mundial que conecta a miembros de las fuerzas y cuerpos de seguridad de todo el planeta. En IPA Xerez, fomentamos la amistad, la cooperacion internacional y el desarrollo profesional.</p>
          </div>
          <div className="flex justify-center mb-8">
            <a href="https://ipa-spain.org" target="_blank" rel="noopener noreferrer" className="bg-[#003366] text-white px-6 py-3 rounded-lg hover:bg-[#002244] transition-colors">Ver IPA España</a>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="font-heading text-2xl text-[#003366] mb-3">Red Global</h3>
              <p className="text-gray-600">Conectados con policias en mas de 140 paises.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="font-heading text-2xl text-[#003366] mb-3">Hermandad</h3>
              <p className="text-gray-600">Fomentamos la amistad y solidaridad profesional.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="font-heading text-2xl text-[#003366] mb-3">Desarrollo</h3>
              <p className="text-gray-600">Formacion y crecimiento profesional continuo.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="beneficios" className="py-20 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl md:text-5xl text-[#003366] text-center mb-16">Nuestros Beneficios</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden hover:scale-105 transform cursor-pointer" onClick={() => window.open('https://ipa-international.org/benefits/travel', '_blank')}>
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${SERVICE1})` }}></div>
              <div className="p-6">
                <h3 className="font-heading text-xl text-[#003366] mb-3">Viajes e Intercambios</h3>
                <p className="text-gray-600">Explora el mundo con colegas de profesion.</p>
              </div>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden hover:scale-105 transform cursor-pointer" onClick={() => window.open('https://ipa-international.org/benefits/learning-development/', '_blank')}>
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${SERVICE2})` }}></div>
              <div className="p-6">
                <h3 className="font-heading text-xl text-[#003366] mb-3">Formacion Especializada</h3>
                <p className="text-gray-600">Webinars y cursos sobre seguridad profesional.</p>
              </div>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden hover:scale-105 transform cursor-pointer" onClick={() => window.open('https://ipa-international.org/events', '_blank')}>
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${SERVICE3})` }}></div>
              <div className="p-6">
                <h3 className="font-heading text-xl text-[#003366] mb-3">Eventos y Cultura</h3>
                <p className="text-gray-600">Zambombas y visitas culturales de Jerez.</p>
              </div>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden hover:scale-105 transform cursor-pointer" onClick={() => window.open('https://ipa-international.org/benefits/discounts-and-offers/', '_blank')}>
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${SERVICE4})` }}></div>
              <div className="p-6">
                <h3 className="font-heading text-xl text-[#003366] mb-3">Beneficios Exclusivos</h3>
                <p className="text-gray-600">Descuentos y acceso a eventos internacionales.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl md:text-5xl text-[#003366] text-center mb-16">Lo que Dicen de Nosotros</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-l-4 border-[#D4AF37] p-8 shadow-lg">
              <p className="text-gray-700 mb-4 italic text-lg">Una asociacion que fomenta la hermandad y desarrollo profesional.</p>
              <p className="font-heading text-[#003366]">Ayuntamiento de Jerez</p>
            </Card>
            <Card className="border-l-4 border-[#D4AF37] p-8 shadow-lg">
              <p className="text-gray-700 mb-4 italic text-lg">Un nuevo espacio para la amistad y cooperacion.</p>
              <p className="font-heading text-[#003366]">Comunidad IPA</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-4xl text-[#003366] text-center mb-12">Próximos Eventos</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-l-4 border-l-[#D4AF37]">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-[#D4AF37]" />
                <h3 className="font-heading text-lg text-[#003366]">Zambomba 2026</h3>
              </div>
              <p className="text-gray-600 text-sm mb-2">Diciembre 2026</p>
              <p className="text-gray-700 mb-4">Celebración tradicional de Jerez con música, gastronomía y camaradería.</p>
              <a href="https://ipa-international.org/sections-area/" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#003366] text-white px-4 py-2 rounded hover:bg-[#1A3A52] transition-colors text-sm">Más Información</a>
            </Card>
            <Card className="p-6 border-l-4 border-l-[#D4AF37]">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-[#D4AF37]" />
                <h3 className="font-heading text-lg text-[#003366]">Intercambio Marruecos</h3>
              </div>
              <p className="text-gray-600 text-sm mb-2">Primavera 2026</p>
              <p className="text-gray-700 mb-4">Viaje internacional de hermandad y cooperación policial.</p>
              <a href="https://ipa-international.org/sections-area/" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#003366] text-white px-4 py-2 rounded hover:bg-[#1A3A52] transition-colors text-sm">Más Información</a>
            </Card>
            <Card className="p-6 border-l-4 border-l-[#D4AF37]">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-[#D4AF37]" />
                <h3 className="font-heading text-lg text-[#003366]">Visita Yeguada</h3>
              </div>
              <p className="text-gray-600 text-sm mb-2">Mayo 2026</p>
              <p className="text-gray-700 mb-4">Experiencia cultural en el patrimonio ecuestre de Jerez.</p>
              <a href="https://ipa-international.org/sections-area/" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#003366] text-white px-4 py-2 rounded hover:bg-[#1A3A52] transition-colors text-sm">Más Información</a>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#003366] text-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-4xl text-center mb-12">Beneficios de ser Miembro</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Gift className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
              <h3 className="font-heading text-lg mb-2">Descuentos Exclusivos</h3>
              <p className="text-gray-300 text-sm">Acceso a ofertas especiales en eventos y servicios.</p>
            </div>
            <div className="text-center">
              <Mail className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
              <h3 className="font-heading text-lg mb-2">Red Global</h3>
              <p className="text-gray-300 text-sm">Conecta con policías en 140+ países.</p>
            </div>
            <div className="text-center">
              <Calendar className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
              <h3 className="font-heading text-lg mb-2">Eventos Internacionales</h3>
              <p className="text-gray-300 text-sm">Participa en viajes y actividades exclusivas.</p>
            </div>
            <div className="text-center">
              <Bell className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
              <h3 className="font-heading text-lg mb-2">Formación Continua</h3>
              <p className="text-gray-300 text-sm">Acceso a webinars y cursos profesionales.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="eventos" className="py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-4xl text-[#003366] text-center mb-12">Próximos Eventos</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <img src={POLICE_WEEK_POSTER} alt="Police Week Washington" className="w-full max-w-sm rounded-lg shadow-lg mb-4" />
              <h3 className="font-heading text-2xl text-[#003366] mb-2">Police Week 2026</h3>
              <p className="text-gray-600 text-center mb-4">Washington D.C. | 11-17 Mayo 2026</p>
              <p className="text-gray-700 text-center mb-6">Vive una experiencia única con IPA Málaga e IPA Xerez. Honra, hermandad y orgullo policial internacional.</p>
              <a href="https://policeweek.org" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#D4AF37] text-[#003366] px-6 py-3 rounded font-semibold hover:bg-[#C4991F] transition-colors">Más Información</a>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="bg-[#003366] text-white p-8 rounded-lg text-center w-full">
                <h3 className="font-heading text-2xl mb-4">Puy du Fou</h3>
                <p className="text-lg mb-2">17-19 Abril 2026</p>
                <p className="text-gray-300 mb-6">Visita al Parque Temático Puy du Fou en Francia</p>
                <p className="text-gray-300 mb-6">Experiencia cultural única con la hermandad de IPA</p>
                <p className="text-sm text-gray-400">Más detalles próximamente</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-4xl text-[#003366] text-center mb-12">Mantente Informado</h2>
          <div className="max-w-md mx-auto">
            <p className="text-center text-gray-600 mb-6">Suscríbete a nuestro boletín para recibir noticias y actualizaciones.</p>
            <form onSubmit={(e) => { e.preventDefault(); setNewsletterStatus('success'); setTimeout(() => { setNewsletterEmail(''); setNewsletterStatus('idle'); }, 3000); }} className="flex gap-2">
              <Input type="email" placeholder="Tu email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} required />
              <Button type="submit" className="bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F]" disabled={newsletterStatus === 'loading'}>
                {newsletterStatus === 'loading' ? 'Enviando...' : 'Suscribirse'}
              </Button>
            </form>
            {newsletterStatus === 'success' && <p className="text-center text-green-600 mt-3">¡Gracias por suscribirte!</p>}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-4xl text-[#003366] text-center mb-12">Ubicación</h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-200 rounded-lg overflow-hidden h-96 flex items-center justify-center">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3148.1234567890!2d-6.1353!3d36.7408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd7aa5e5e5e5e5e5d%3A0x1234567890abcdef!2sJerez%20de%20la%20Frontera%2C%20C%C3%A1diz!5e0!3m2!1ses!2ses!4v1234567890" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-700 text-lg">Jerez de la Frontera, Cádiz, España</p>
              <p className="text-gray-600 mt-2">Síguenos en nuestras redes sociales para más información</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-4xl text-[#003366] text-center mb-12">Preguntas Frecuentes</h2>
          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-heading text-lg text-[#003366]">{faq.q}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-[#D4AF37] transition-transform ${
                      openFAQ === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFAQ === idx && (
                  <div className="px-6 pb-6 border-t border-gray-200 pt-4">
                    <p className="text-gray-700">{faq.a}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="py-20 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl text-[#003366] text-center mb-4">Ponte en Contacto</h2>
            <p className="text-center text-gray-600 mb-12 text-lg">Tienes preguntas? Nos encantaria escucharte.</p>
            <Card className="p-8 shadow-lg border-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-heading text-[#003366] mb-2">Nombre</label>
                    <Input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Tu nombre" required />
                  </div>
                  <div>
                    <label className="block text-sm font-heading text-[#003366] mb-2">Email</label>
                    <Input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="tu@email.com" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-heading text-[#003366] mb-2">Telefono</label>
                  <Input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+34 615 146 692" />
                </div>
                <div>
                  <label className="block text-sm font-heading text-[#003366] mb-2">Asunto</label>
                  <Input type="text" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Asunto" required />
                </div>
                <div>
                  <label className="block text-sm font-heading text-[#003366] mb-2">Mensaje</label>
                  <Textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Cuentanos mas..." className="min-h-[150px]" required />
                </div>
                <Button type="submit" disabled={submitStatus === "loading"} className="w-full bg-[#003366] hover:bg-[#1A3A52] text-white py-6 text-lg font-heading">
                  {submitStatus === "loading" ? "Enviando..." : "Enviar Mensaje"}
                  <Send className="ml-2 w-5 h-5" />
                </Button>
                {submitStatus === "success" && <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center">Mensaje enviado con exito!</div>}
              </form>
            </Card>
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Mail className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                <p className="font-heading text-[#003366] mb-1">Email</p>
                <p className="text-gray-600">ipaagrupacionxerez@gmail.com</p>
              </div>
              <div className="text-center">
                <Phone className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                <p className="font-heading text-[#003366] mb-1">Telefono</p>
                <p className="text-gray-600">+34 675 508 110</p>
              </div>
              <div className="text-center">
                <MapPin className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                <p className="font-heading text-[#003366] mb-1">Ubicacion</p>
                <p className="text-gray-600">Jerez de la Frontera, Cadiz</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="font-heading text-3xl text-[#003366] mb-2">Síguenos en Instagram</h2>
            <p className="text-gray-600">Descubre nuestras últimas actividades y eventos</p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <InstagramFeed username="ipa_xerez" />
            </div>
          </div>
        </div>
      </section>

      <a href="https://instagram.com/ipa_xerez" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white rounded-full p-2 transition-all duration-300 hover:scale-110" title="Síguenos en Instagram"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/></svg></a>
            <a href="https://wa.me/34675508110" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 z-40" title="Contactanos por WhatsApp"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.37 1.237-3.285 2.152-1.81 1.81-2.834 4.158-2.834 6.664 0 2.506 1.023 4.854 2.834 6.664 1.81 1.81 4.158 2.834 6.664 2.834 2.506 0 4.854-1.023 6.664-2.834 1.81-1.81 2.834-4.158 2.834-6.664 0-2.506-1.023-4.854-2.834-6.664-1.81-1.81-4.158-2.834-6.664-2.834z" /></svg></a>

      {showInscriptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#003366] text-white p-6 flex justify-between items-center">
              <h2 className="font-heading text-2xl">Formulario de Inscripción</h2>
              <button onClick={() => setShowInscriptionModal(false)} className="text-2xl hover:text-gray-300 transition-colors">×</button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">Descarga el formulario de inscripción para unirte a IPA Xerez. Complétalo y envíalo a nuestro correo de contacto.</p>
              <div className="flex gap-4">
                <a href={INSCRIPTION_FORM} download className="flex-1 bg-[#D4AF37] text-[#003366] px-6 py-3 rounded font-semibold hover:bg-[#C4991F] transition-colors text-center">Descargar Formulario</a>
                <a href="https://wa.me/34675508110" target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-500 text-white px-6 py-3 rounded font-semibold hover:bg-green-600 transition-colors text-center">Contactar por WhatsApp</a>
              </div>
              <div className="mt-6 p-4 bg-gray-100 rounded">
                <h3 className="font-semibold text-[#003366] mb-2">Información de Contacto:</h3>
                <p className="text-gray-700">📧 Email: ipaagrupacionxerez@gmail.com</p>
                <p className="text-gray-700">📱 WhatsApp: +34 675 508 110</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <li><a href="#" className="hover:text-[#D4AF37]">Inicio</a></li>
                <li><a href="#" className="hover:text-[#D4AF37]">Servicios</a></li>
                <li><a href="https://ipa-spain.org" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37]">IPA España</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-lg mb-4">Síguenos</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="https://www.facebook.com/profile.php?id=61572445883496" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37]">Facebook</a></li>
                <li><a href="https://www.tiktok.com/@ipa.xerez" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37]">TikTok</a></li>
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
