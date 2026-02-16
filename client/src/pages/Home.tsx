import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Calendar, Gift, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import InstagramFeed from "@/components/InstagramFeed";

const HERO_IMAGE = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/EGzPdIJIBsAxVVTe.jpg";
const SERVICE1 = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/nvjJjBUwnyhcczkq.png";
const SERVICE2 = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/qCidfLJSuGzIfQKh.png";
const SERVICE3 = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/pxJHGJxIBfjHfXPS.png";
const SERVICE4 = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/LFYIcqdErinfJBcX.png";

export default function Home() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success">("idle");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success">("idle");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

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
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#003366] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">IPA</span>
            </div>
            <span className="font-heading text-[#003366] text-xl hidden sm:inline">IPA Xerez</span>
          </div>
          <div className="flex gap-4 items-center">
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5]" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Inicio</Button>
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5]" onClick={() => document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' })}>Beneficios</Button>
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5]" onClick={() => navigate('/gallery')}>Galería</Button>
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5]" onClick={() => navigate('/blog')}>Blog</Button>
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5]" onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}>FAQ</Button>
            <Button className="bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F]" onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}>Unete Ahora</Button>
            <a href="https://wa.me/34675508110" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition-all duration-300 hover:scale-110" title="Contactanos por WhatsApp"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.37 1.237-3.285 2.152-1.81 1.81-2.834 4.158-2.834 6.664 0 2.506 1.023 4.854 2.834 6.664 1.81 1.81 4.158 2.834 6.664 2.834 2.506 0 4.854-1.023 6.664-2.834 1.81-1.81 2.834-4.158 2.834-6.664 0-2.506-1.023-4.854-2.834-6.664-1.81-1.81-4.158-2.834-6.664-2.834z" /></svg></a>
          </div>
        </div>
      </nav>

      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="font-display text-5xl md:text-6xl mb-6 leading-tight">Amistad y Profesionalidad sin Fronteras</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">Unete a la mayor red mundial de policias bajo nuestro lema Servo per Amikeco</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button className="bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F] text-lg px-8 py-6" onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}>Hazte Socio Ahora</Button>
              <Button variant="outline" className="text-white border-white hover:bg-white/10 text-lg px-8 py-6" onClick={() => window.open('https://ipa-international.org/about', '_blank')}>Mas Informacion</Button>
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

      <a href="https://wa.me/34675508110" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 z-40" title="Contactanos por WhatsApp"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.37 1.237-3.285 2.152-1.81 1.81-2.834 4.158-2.834 6.664 0 2.506 1.023 4.854 2.834 6.664 1.81 1.81 4.158 2.834 6.664 2.834 2.506 0 4.854-1.023 6.664-2.834 1.81-1.81 2.834-4.158 2.834-6.664 0-2.506-1.023-4.854-2.834-6.664-1.81-1.81-4.158-2.834-6.664-2.834z" /></svg></a>

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
              <h4 className="font-heading text-lg mb-4">Siguenos</h4>
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
