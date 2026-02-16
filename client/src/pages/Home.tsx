import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

const HERO_IMAGE = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/EGzPdIJIBsAxVVTe.jpg";
const SERVICE1 = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/AUbevYGAaJTmQvTB.jpg";
const SERVICE2 = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/sqOPmaIMatHTqxfg.jpg";
const SERVICE3 = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/pwedeNkkKLNlIuoo.jpg";
const SERVICE4 = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/pwedeNkkKLNlIuoo.jpg";

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success">("idle");

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
          <div className="flex gap-4">
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5]" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Inicio</Button>
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5]" onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}>Servicios</Button>
            <Button className="bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F]" onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}>Unete Ahora</Button>
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
              <Button className="bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F] text-lg px-8 py-6">Hazte Socio Ahora</Button>
              <Button variant="outline" className="text-white border-white hover:bg-white/10 text-lg px-8 py-6">Mas Informacion</Button>
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

      <section id="servicios" className="py-20 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl md:text-5xl text-[#003366] text-center mb-16">Nuestros Servicios</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden hover:scale-105 transform">
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${SERVICE1})` }}></div>
              <div className="p-6">
                <h3 className="font-heading text-xl text-[#003366] mb-3">Viajes e Intercambios</h3>
                <p className="text-gray-600">Explora el mundo con colegas de profesion.</p>
              </div>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden hover:scale-105 transform">
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${SERVICE2})` }}></div>
              <div className="p-6">
                <h3 className="font-heading text-xl text-[#003366] mb-3">Formacion Especializada</h3>
                <p className="text-gray-600">Webinars y cursos sobre seguridad profesional.</p>
              </div>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden hover:scale-105 transform">
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${SERVICE3})` }}></div>
              <div className="p-6">
                <h3 className="font-heading text-xl text-[#003366] mb-3">Eventos y Cultura</h3>
                <p className="text-gray-600">Zambombas y visitas culturales de Jerez.</p>
              </div>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden hover:scale-105 transform">
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
                <p className="text-gray-600">+34 615 146 692</p>
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
