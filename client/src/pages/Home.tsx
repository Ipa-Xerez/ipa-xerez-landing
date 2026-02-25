import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Calendar, Timer, Users, Globe, Heart, Award, Zap, ChevronDown, ArrowRight, Menu, X, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

import EventsCarousel from "@/components/EventsCarousel";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const HERO_IMAGE = "/Portada Nueva.jpg";
const SERVICE1 = "/Service1.png";
const SERVICE2 = "/Service2.png";
const SERVICE3 = "/Service3.png";
const SERVICE4 = "/Service4.png";
const POLICE_WEEK_POSTER = "/poster washington.jpg";
const INSCRIPTION_FORM = "/INSCRIPCION.pdf";

export default function Home() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success">("idle");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showInscriptionModal, setShowInscriptionModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const nextEventQuery = trpc.events.getNext.useQuery();

  useEffect(() => {
    if (nextEventQuery.data) {
      setNextEvent(nextEventQuery.data);
      setLoadingEvent(false);
    }
  }, [nextEventQuery.data]);

  const faqs = [
    { q: "¿Cómo me uno a IPA Xerez?", a: "Puedes unirte completando el formulario de contacto o enviándonos un mensaje por WhatsApp. Te guiaremos en todo el proceso de membresía." },
    { q: "¿Cuál es el costo de la membresía?", a: "Los costos de membresía varían según el tipo. Contáctanos para recibir información detallada sobre las opciones disponibles." },
    { q: "¿Cuáles son los beneficios de ser miembro?", a: "Acceso a descuentos exclusivos, red global de 140+ países, eventos internacionales, formación continua y mucha más camaradería." },
    { q: "¿Puedo participar en los intercambios internacionales?", a: "Sí, todos nuestros miembros, socios y familiares pueden participar en cualquier evento de IPA. Organizamos intercambios y viajes internacionales en diferentes países." },
    { q: "¿Hay eventos locales en Jerez?", a: "Sí, organizamos eventos culturales como las Zambombas, visitas a la Yeguada y reuniones mensuales de camaradería." },
    { q: "¿Necesito ser policía en activo?", a: "No, también aceptamos policías jubilados y personal de seguridad. IPA es para todos los que compartan nuestros valores." }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createContactMutation = trpc.contact.create.useMutation();
  const subscribeNewsletter = trpc.newsletter.subscribe.useMutation();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterName, setNewsletterName] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus("loading");

    try {
      const result = await subscribeNewsletter.mutateAsync({
        email: newsletterEmail,
        name: newsletterName || undefined,
      });

      if (result.success) {
        setNewsletterStatus("success");
        setNewsletterMessage(result.message);
        setNewsletterEmail("");
        setNewsletterName("");
        setTimeout(() => {
          setNewsletterStatus("idle");
          setNewsletterMessage("");
        }, 5000);
      } else {
        setNewsletterStatus("error");
        setNewsletterMessage(result.message);
        setTimeout(() => setNewsletterStatus("idle"), 5000);
      }
    } catch (error: any) {
      setNewsletterStatus("error");
      setNewsletterMessage(error.message || "Error al suscribirse. Inténtalo de nuevo.");
      setTimeout(() => setNewsletterStatus("idle"), 5000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");
    
    try {
      await createContactMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject,
        message: formData.message,
      });
      
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar mejorada */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/AgkWeOTDyZirPRUK.png" alt="IPA Xerez" className="h-12 w-auto" />
            <span className="font-heading text-[#003366] text-xl hidden sm:inline font-bold">IPA Xerez</span>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-2 md:gap-4 items-center flex-wrap justify-end">
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5] text-sm md:text-base" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Inicio</Button>
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5] text-sm md:text-base" onClick={() => document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' })}>Beneficios</Button>
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5] text-sm md:text-base" onClick={() => navigate('/gallery')}>Galería</Button>
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5] text-sm md:text-base" onClick={() => navigate('/blog')}>Blog</Button>
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5] text-sm md:text-base" onClick={() => navigate('/calendar')}>Calendario</Button>
            <Button variant="ghost" className="text-[#003366] hover:bg-[#F5F5F5] text-sm md:text-base" onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}>FAQ</Button>
            {isAuthenticated && <button onClick={() => navigate('/admin/documents')} className="hover:opacity-80 transition-opacity" title="Panel de Administración"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/AgkWeOTDyZirPRUK.png" alt="Panel Admin" className="h-8 w-auto" /></button>}

            <PWAInstallButton />
            <div className="flex gap-2">
              <a href="https://www.facebook.com/profile.php?id=61572445883496" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-all duration-300 hover:scale-110" title="Facebook"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
              <a href="https://www.tiktok.com/@ipa.xerez" target="_blank" rel="noopener noreferrer" className="bg-black hover:bg-gray-800 text-white rounded-full p-2 transition-all duration-300 hover:scale-110" title="TikTok"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.89 2.89 0 0 1 2.31-4.64 2.86 2.86 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.54-.05z"/></svg></a>
              <a href="https://instagram.com/ipa_xerez" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white rounded-full p-2 transition-all duration-300 hover:scale-110" title="Instagram"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/></svg></a>
              <a href="https://wa.me/34675508110" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition-all duration-300 hover:scale-110" title="WhatsApp"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.37 1.237-3.285 2.152-1.81 1.81-2.834 4.158-2.834 6.664 0 2.506 1.023 4.854 2.834 6.664 1.81 1.81 4.158 2.834 6.664 2.834 2.506 0 4.854-1.023 6.664-2.834 1.81-1.81 2.834-4.158 2.834-6.664 0-2.506-1.023-4.854-2.834-6.664-1.81-1.81-4.158-2.834-6.664-2.834z" /></svg></a>
            </div>
          </div>
          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#003366] p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-2">
            <Button variant="ghost" className="w-full text-left text-[#003366] hover:bg-[#F5F5F5] text-sm" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }}>Inicio</Button>
            <Button variant="ghost" className="w-full text-left text-[#003366] hover:bg-[#F5F5F5] text-sm" onClick={() => { document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}>Beneficios</Button>
            <Button variant="ghost" className="w-full text-left text-[#003366] hover:bg-[#F5F5F5] text-sm" onClick={() => { navigate('/gallery'); setMobileMenuOpen(false); }}>Galería</Button>
            <Button variant="ghost" className="w-full text-left text-[#003366] hover:bg-[#F5F5F5] text-sm" onClick={() => { navigate('/blog'); setMobileMenuOpen(false); }}>Blog</Button>
            <Button variant="ghost" className="w-full text-left text-[#003366] hover:bg-[#F5F5F5] text-sm" onClick={() => { navigate('/calendar'); setMobileMenuOpen(false); }}>Calendario</Button>
            <Button variant="ghost" className="w-full text-left text-[#003366] hover:bg-[#F5F5F5] text-sm" onClick={() => { document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}>FAQ</Button>
            {isAuthenticated && <Button variant="ghost" className="w-full text-left text-[#D4AF37] hover:bg-[#D4AF37]/10 text-sm font-bold" onClick={() => { navigate('/admin/documents'); setMobileMenuOpen(false); }}>Panel Admin</Button>}
            <Button className="w-full bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700] text-sm font-bold" onClick={() => { document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}>Únete</Button>
            <div className="flex gap-2 pt-2">
              <a href="https://www.facebook.com/profile.php?id=61572445883496" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-all duration-300" title="Facebook"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
              <a href="https://www.tiktok.com/@ipa.xerez" target="_blank" rel="noopener noreferrer" className="bg-black hover:bg-gray-800 text-white rounded-full p-2 transition-all duration-300" title="TikTok"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.89 2.89 0 0 1 2.31-4.64 2.86 2.86 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.54-.05z"/></svg></a>
              <a href="https://instagram.com/ipa_xerez" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white rounded-full p-2 transition-all duration-300" title="Instagram"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/></svg></a>
              <a href="https://wa.me/34675508110" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition-all duration-300" title="WhatsApp"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.37 1.237-3.285 2.152-1.81 1.81-2.834 4.158-2.834 6.664 0 2.506 1.023 4.854 2.834 6.664 1.81 1.81 4.158 2.834 6.664 2.834 2.506 0 4.854-1.023 6.664-2.834 1.81-1.81 2.834-4.158 2.834-6.664 0-2.506-1.023-4.854-2.834-6.664-1.81-1.81-4.158-2.834-6.664-2.834z" /></svg></a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero mejorado */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>
        </div>
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-6 inline-block">
              <div className="bg-[#D4AF37]/20 border border-[#D4AF37] rounded-full px-6 py-2 text-[#D4AF37] text-xs md:text-sm font-semibold backdrop-blur-sm">
                ✨ 370.000+ Miembros | Más de 60 Países | Servo per Amikeco
              </div>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-2 leading-tight font-bold drop-shadow-lg">ASOCIACIÓN INTERNACIONAL</h1>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight font-bold drop-shadow-lg">DE POLICÍAS</h1>
            <p className="text-2xl md:text-3xl mb-6 text-[#D4AF37] drop-shadow-md font-semibold">AGRUPACIÓN XEREZ</p>
            <p className="text-lg md:text-2xl mb-10 text-gray-100 drop-shadow-md max-w-2xl mx-auto">Únete a IPA Xerez: la mayor asociación policial del mundo con 370.000+ miembros. Amistad, profesionalidad y hermandad internacional en más de 60 países</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button className="bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700] text-base md:text-lg px-8 md:px-10 py-6 md:py-7 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2" onClick={() => setShowInscriptionModal(true)}>
                Hazte Socio Ahora <ArrowRight className="w-5 h-5" />
              </Button>
              <Button className="bg-red-600 text-white hover:bg-red-700 text-base md:text-lg px-8 md:px-10 py-6 md:py-7 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" onClick={() => window.open('https://ipa-international.org/about', '_blank')}>
                Más Información
              </Button>
              <Button className="bg-white/20 text-white hover:bg-white/30 text-base md:text-lg px-8 md:px-10 py-6 md:py-7 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 border-2 border-white backdrop-blur-sm" onClick={() => navigate('/socios')}>
                <LogIn className="w-5 h-5" /> Acceso Socios
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Próxima Actividad Widget - Posicionado en el hero */}
      {nextEvent && (
      <div className="fixed left-4 top-28 md:top-32 z-40 w-56 md:w-64">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="relative h-32 bg-cover bg-center cursor-pointer hover:opacity-90 transition-opacity" style={{ backgroundImage: `url(${nextEvent.image || POLICE_WEEK_POSTER})` }} onClick={() => navigate(`/evento/${nextEvent.id}`)}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              🔹 Próximo
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-bold text-[#003366] mb-2 text-xs line-clamp-2">{nextEvent.title}</h3>
            <div className="space-y-1 text-xs text-gray-700 mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#D4AF37]" />
                <span className="font-semibold">{new Date(nextEvent.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#D4AF37]" />
                <span className="font-semibold text-xs line-clamp-1">{nextEvent.location || 'Por confirmar'}</span>
              </div>
            </div>
            <Button className="bg-red-600 text-white hover:bg-red-700 font-bold px-2 py-1 text-xs w-full" onClick={() => {
              const message = `Hola, me interesa la actividad de ${nextEvent.title} del ${new Date(nextEvent.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}.`;
              const encodedMessage = encodeURIComponent(message);
              window.open(`https://wa.me/34675508110?text=${encodedMessage}`, '_blank');
            }}>
              📞 Me apunto
            </Button>
          </div>
        </div>
      </div>
      )}
      
      {/* Espaciador para que el contenido no se superponga con el widget fijo */}
      <div className="hidden md:block h-0"></div>

      {/* Sección Descripción SEO */}
      <section className="py-12 md:py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl text-[#003366] mb-4 font-bold">Sobre IPA Xerez</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              <strong>IPA Xerez es la agrupación local de la International Police Association en Jerez de la Frontera</strong>, dedicada a promover la amistad entre policías, la formación profesional continua y las actividades culturales y profesionales. Como parte de una red global de más de 370.000 miembros en 140+ países, IPA Xerez representa los valores de hermandad, solidaridad y cooperación internacional sin fronteras.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Nuestra misión es fortalecer los lazos de camaradería entre profesionales de la seguridad, facilitar intercambios internacionales, ofrecer formación especializada y crear oportunidades de desarrollo profesional. Bajo el lema "Servo per Amikeco" (Servir por la Amistad), trabajamos para construir una comunidad policial global basada en valores compartidos de profesionalidad, integridad y hermandad.
            </p>
          </div>
        </div>
      </section>

      {/* Sección Mantente Informado */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#D4AF37] to-[#FFD700]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl text-[#003366] mb-4 font-bold">Mantente Informado</h2>
            <p className="text-[#003366] mb-8 text-lg">Suscríbete a nuestro newsletter para recibir actualizaciones sobre eventos, noticias y oportunidades exclusivas de IPA Xerez</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Tu nombre (opcional)"
                value={newsletterName}
                onChange={(e) => setNewsletterName(e.target.value)}
                className="flex-1 bg-white text-[#003366] placeholder-gray-500 border-0"
              />
              <Input
                type="email"
                placeholder="Tu email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1 bg-white text-[#003366] placeholder-gray-500 border-0"
              />
              <Button
                type="submit"
                disabled={newsletterStatus === "loading"}
                className="bg-[#003366] text-white hover:bg-[#002244] font-bold px-6 md:px-8"
              >
                {newsletterStatus === "loading" ? "Suscribiendo..." : "Suscribirse"}
              </Button>
            </form>
            {newsletterStatus === "success" && (
              <p className="text-green-700 mt-4 font-semibold">{newsletterMessage}</p>
            )}
            {newsletterStatus === "error" && (
              <p className="text-red-700 mt-4 font-semibold">{newsletterMessage}</p>
            )}
          </div>
        </div>
      </section>

      {/* Sección de Valores mejorada */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-[#003366] to-[#004d99] text-white">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-center mb-12 font-bold">¿Por qué unirse a IPA Xerez? Beneficios de la Hermandad Policial</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <Globe className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]" />
              <h3 className="font-heading text-xl mb-2 font-bold">Red Global de Policías</h3>
              <p className="text-gray-100 text-sm">Conecta con policías internacionales en 140+ países. Hermandad policial sin fronteras</p>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <Heart className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]" />
              <h3 className="font-heading text-xl mb-2 font-bold">Hermandad Policial</h3>
              <p className="text-gray-100 text-sm">Amistad, solidaridad y camaradería profesional entre policías</p>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <Award className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]" />
              <h3 className="font-heading text-xl mb-2 font-bold">Beneficios Exclusivos</h3>
              <p className="text-gray-100 text-sm">Descuentos, viajes internacionales y eventos policiales exclusivos</p>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <Zap className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]" />
              <h3 className="font-heading text-xl mb-2 font-bold">Desarrollo Profesional</h3>
              <p className="text-gray-100 text-sm">Formación continua y crecimiento profesional en seguridad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Historia mejorada */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-[#003366] mb-8 font-bold text-center">Nuestra Historia</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-[#003366]/5 to-[#D4AF37]/5 p-6 rounded-lg border-l-4 border-[#D4AF37]">
                <h3 className="font-heading text-xl text-[#003366] mb-4 font-bold">Fundación de IPA (1950)</h3>
                <p className="text-gray-700 leading-relaxed mb-3">La International Police Association fue fundada en 1950 en el Reino Unido por Arthur Troop, sargento de policía de Lincolnshire. Su visión fue fomentar la amistad entre policías de distintos países tras la Segunda Guerra Mundial, construyendo puentes de hermandad internacional.</p>
                <p className="text-gray-700 leading-relaxed">La primera sección nacional fue la del Reino Unido, y poco después comenzaron a incorporarse otros países europeos, expandiendo la red global de la organización.</p>
              </div>
              
              <div className="bg-gradient-to-br from-[#D4AF37]/5 to-[#003366]/5 p-6 rounded-lg border-l-4 border-[#003366]">
                <h3 className="font-heading text-xl text-[#003366] mb-4 font-bold">IPA Hoy</h3>
                <p className="text-gray-700 leading-relaxed mb-3">Hoy, la International Police Association es la mayor asociación policial del mundo con más de 370.000 miembros en más de 60 países. En IPA Xerez, continuamos con la misión original: fomentar la amistad, la cooperación internacional y el desarrollo profesional.</p>
                <p className="text-gray-700 leading-relaxed">Nuestro lema "Servo per Amikeco" (Servir por la Amistad) refleja los valores fundamentales de hermandad, solidaridad y profesionalismo que nos unen.</p>
              </div>
            </div>
            
            <div className="text-center">
              <a href="https://ipa-spain.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#003366] text-white px-6 py-3 rounded-lg hover:bg-[#002244] transition-colors font-semibold">
                Ver IPA España <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios mejorados */}
      <section id="beneficios" className="py-16 md:py-20 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-[#003366] text-center mb-12 font-bold">Nuestros Beneficios</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${SERVICE1})` }}></div>
              <div className="p-6">
                <h3 className="font-heading text-lg text-[#003366] mb-3 font-bold">Viajes e Intercambios</h3>
                <p className="text-gray-600 text-sm">Explora el mundo con colegas de profesión</p>
              </div>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${SERVICE2})` }}></div>
              <div className="p-6">
                <h3 className="font-heading text-lg text-[#003366] mb-3 font-bold">Formación Especializada</h3>
                <p className="text-gray-600 text-sm">Webinars y cursos sobre seguridad profesional</p>
              </div>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${SERVICE3})` }}></div>
              <div className="p-6">
                <h3 className="font-heading text-lg text-[#003366] mb-3 font-bold">Eventos y Cultura</h3>
                <p className="text-gray-600 text-sm">Zambombas y visitas culturales de Jerez</p>
              </div>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
              <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${SERVICE4})` }}></div>
              <div className="p-6">
                <h3 className="font-heading text-lg text-[#003366] mb-3 font-bold">Beneficios Exclusivos</h3>
                <p className="text-gray-600 text-sm">Descuentos y acceso a eventos internacionales</p>
              </div>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-[#003366] to-[#D4AF37] flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">🏠</div>
                  <p className="font-bold">Casas IPA</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-heading text-lg text-[#003366] mb-3 font-bold">Casas IPA</h3>
                <p className="text-gray-600 text-sm">Alojamiento exclusivo para miembros en todo el mundo</p>
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1 bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F] text-xs" onClick={() => window.open('https://ipa-international.org/ipa-houses/', '_blank')}>Más Info</Button>
                  <Button className="flex-1 bg-[#003366] text-white hover:bg-[#002244] text-xs" onClick={() => window.open('https://ipa-international.org/wp-content/uploads/2025/12/IPAHOS1.pdf', '_blank')}>PDF</Button>
                </div>
              </div>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-[#D4AF37] to-[#003366] flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">🔐</div>
                  <p className="font-bold">Zona de Socios</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-heading text-lg text-[#003366] mb-3 font-bold">Acceso Socios</h3>
                <p className="text-gray-600 text-sm">Área privada con documentos y recursos exclusivos</p>
                <Button className="w-full bg-[#003366] text-white hover:bg-[#002244] text-sm mt-4" onClick={() => navigate('/socios')}>Acceder</Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-[#003366] text-center mb-12 font-bold">Lo que Dicen de Nosotros</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-l-4 border-[#D4AF37] p-8 shadow-lg">
              <p className="text-gray-700 mb-4 italic text-base">"Una asociación que fomenta la hermandad y desarrollo profesional entre policías de todo el mundo."</p>
              <p className="font-heading text-[#003366] font-bold">Ayuntamiento de Jerez</p>
            </Card>
            <Card className="border-l-4 border-[#D4AF37] p-8 shadow-lg">
              <p className="text-gray-700 mb-4 italic text-base">"Un nuevo espacio para la amistad y cooperación policial sin fronteras."</p>
              <p className="font-heading text-[#003366] font-bold">Comunidad IPA</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Próximos Eventos con Carrusel */}
      <section id="eventos" className="py-16 md:py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-[#003366] text-center mb-12 font-bold">Próximos Eventos</h2>
          <EventsCarousel />
        </div>
      </section>

      {/* Ubicación mejorada */}
      {/* Testimonios */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-[#F5F5F5] to-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-[#003366] mb-6 font-bold">Lo que Dicen Nuestros Miembros</h2>
            <p className="text-lg text-gray-600">Descubre cómo IPA ha impactado la vida de policías de todo el mundo</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Testimonio 1 */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-[#D4AF37]">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <img src="/testimonial-carlos.jpg" alt="Carlos García" className="w-16 h-16 rounded-full object-cover" />
                  <span className="absolute -bottom-1 -right-1 bg-[#D4AF37] text-[#003366] text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">IA</span>
                </div>
                <div className="text-left">
                  <h3 className="font-heading text-lg text-[#003366] font-semibold">Carlos García</h3>
                  <p className="text-sm text-gray-500">Policía Nacional, Xerez</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">"Hace 5 años conocí a un policía de Tailandia en un evento de IPA. Hoy somos grandes amigos. Cuando viajé a Bangkok, él me mostró su ciudad. Eso es lo que IPA te ofrece: amigos en cualquier parte del mundo."</p>
              <div className="flex gap-1 text-[#D4AF37]">★★★★★</div>
            </div>
            
            {/* Testimonio 2 */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-[#D4AF37]">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <img src="/testimonial-maria.jpg" alt="María López" className="w-16 h-16 rounded-full object-cover" />
                  <span className="absolute -bottom-1 -right-1 bg-[#D4AF37] text-[#003366] text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">IA</span>
                </div>
                <div className="text-left">
                  <h3 className="font-heading text-lg text-[#003366] font-semibold">María López</h3>
                  <p className="text-sm text-gray-500">Policía Nacional, Xerez</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">"La camaradería en IPA es increíble. Cuando tuve un problema familiar, policías de otros países me apoyaron. Es como tener una familia extendida en 140 países."</p>
              <div className="flex gap-1 text-[#D4AF37]">★★★★★</div>
            </div>
            
            {/* Testimonio 3 */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-[#D4AF37]">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <img src="/testimonial-juan.jpg" alt="Juan Rodríguez" className="w-16 h-16 rounded-full object-cover" />
                  <span className="absolute -bottom-1 -right-1 bg-[#D4AF37] text-[#003366] text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">IA</span>
                </div>
                <div className="text-left">
                  <h3 className="font-heading text-lg text-[#003366] font-semibold">Juan Rodríguez</h3>
                  <p className="text-sm text-gray-500">Policía Local, Xerez</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">"Mis padres viajaron a Portugal hace años. Hace poco, conocí a un policía de allá en IPA. Nos hemos hecho amigos y cuando vuelva a Portugal, tendré un amigo esperándome."</p>
              <div className="flex gap-1 text-[#D4AF37]">★★★★★</div>
            </div>
            
            {/* Testimonio 4 */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-[#D4AF37]">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <img src="/testimonial-ana.jpg" alt="Ana Martínez" className="w-16 h-16 rounded-full object-cover" />
                  <span className="absolute -bottom-1 -right-1 bg-[#D4AF37] text-[#003366] text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">IA</span>
                </div>
                <div className="text-left">
                  <h3 className="font-heading text-lg text-[#003366] font-semibold">Ana Martínez</h3>
                  <p className="text-sm text-gray-500">Policía Nacional, Xerez</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">"IPA te conecta con profesionales de tu misma vocación en todo el mundo. Puedo llamar a un colega en Japón, Alemania o Brasil. Eso es hermandad real."</p>
              <div className="flex gap-1 text-[#D4AF37]">★★★★★</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-[#003366] text-center mb-12 font-bold">Ubicación</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-200 rounded-lg overflow-hidden h-96 flex items-center justify-center mb-8">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3148.1234567890!2d-6.1353!3d36.7408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd7aa5e5e5e5e5e5d%3A0x1234567890abcdef!2sJerez%20de%20la%20Frontera%2C%20C%C3%A1diz!5e0!3m2!1ses!2ses!4v1234567890" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <div className="text-center">
              <p className="text-gray-700 text-lg font-semibold mb-2">Jerez de la Frontera, Cádiz, España</p>
              <p className="text-gray-600">Síguenos en nuestras redes sociales para más información y actualizaciones</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ mejorado */}
      <section id="faq" className="py-16 md:py-20 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-[#003366] text-center mb-12 font-bold">Preguntas Frecuentes</h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-heading text-lg text-[#003366] font-semibold">{faq.q}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-[#D4AF37] transition-transform flex-shrink-0 ${
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

      {/* Contacto mejorado */}
      <section id="contacto" className="py-16 md:py-20 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-[#003366] text-center mb-4 font-bold">Ponte en Contacto</h2>
            <p className="text-center text-gray-600 mb-12 text-lg">¿Tienes preguntas? Nos encantaría escucharte.</p>
            <Card className="p-8 shadow-lg border-0 mb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-heading text-[#003366] mb-2 font-bold">Nombre</label>
                    <Input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Tu nombre" required />
                  </div>
                  <div>
                    <label className="block text-sm font-heading text-[#003366] mb-2 font-bold">Email</label>
                    <Input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="tu@email.com" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-heading text-[#003366] mb-2 font-bold">Teléfono</label>
                  <Input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+34 615 146 692" />
                </div>
                <div>
                  <label className="block text-sm font-heading text-[#003366] mb-2 font-bold">Asunto</label>
                  <Input type="text" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Asunto" required />
                </div>
                <div>
                  <label className="block text-sm font-heading text-[#003366] mb-2 font-bold">Mensaje</label>
                  <Textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Cuéntanos más..." className="min-h-[150px]" required />
                </div>
                <Button type="submit" disabled={submitStatus === "loading"} className="w-full bg-[#003366] hover:bg-[#1A3A52] text-white py-6 text-lg font-heading font-bold flex items-center justify-center gap-2">
                  {submitStatus === "loading" ? "Enviando..." : "Enviar Mensaje"}
                  {submitStatus !== "loading" && <Send className="w-5 h-5" />}
                </Button>
                {submitStatus === "success" && <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center font-semibold">¡Mensaje enviado con éxito!</div>}
              </form>
            </Card>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Mail className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                <p className="font-heading text-[#003366] mb-1 font-bold">Email</p>
                <p className="text-gray-600 text-sm">ipaagrupacionxerez@gmail.com</p>
              </div>
              <div className="text-center">
                <Phone className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                <p className="font-heading text-[#003366] mb-1 font-bold">Teléfono</p>
                <p className="text-gray-600 text-sm">+34 675 508 110</p>
              </div>
              <div className="text-center">
                <MapPin className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                <p className="font-heading text-[#003366] mb-1 font-bold">Ubicación</p>
                <p className="text-gray-600 text-sm">Jerez de la Frontera, Cádiz</p>
              </div>
            </div>
          </div>
        </div>
      </section>





      {/* Modal de Inscripción */}
      {showInscriptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#003366] text-white p-6 flex justify-between items-center">
              <h2 className="font-heading text-2xl font-bold">Formulario de Inscripción</h2>
              <button onClick={() => setShowInscriptionModal(false)} className="text-2xl hover:text-gray-300 transition-colors">×</button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">Descarga el formulario de inscripción para unirte a IPA Xerez. Complétalo y envíalo a nuestro correo de contacto.</p>
              <div className="flex gap-4 flex-col md:flex-row">
                <a href={INSCRIPTION_FORM} download className="flex-1 bg-[#D4AF37] text-[#003366] px-6 py-3 rounded font-semibold hover:bg-[#C4991F] transition-colors text-center">Descargar Formulario</a>
                <a href="https://wa.me/34675508110" target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-500 text-white px-6 py-3 rounded font-semibold hover:bg-green-600 transition-colors text-center">Contactar por WhatsApp</a>
              </div>
              <div className="mt-6 p-4 bg-gray-100 rounded">
                <h3 className="font-semibold text-[#003366] mb-2 font-bold">Información de Contacto:</h3>
                <p className="text-gray-700">📧 Email: ipaagrupacionxerez@gmail.com</p>
                <p className="text-gray-700">📱 WhatsApp: +34 675 508 110</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-[#003366] to-[#004d99]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl text-white mb-4 font-bold">Mantente Informado</h2>
            <p className="text-gray-100 mb-8">Suscríbete a nuestro newsletter y recibe información sobre eventos, noticias y oportunidades de IPA Xerez directamente en tu correo.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <Input
                type="text"
                placeholder="Tu nombre (opcional)"
                value={newsletterName}
                onChange={(e) => setNewsletterName(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-200 max-w-xs"
              />
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-200 max-w-xs"
              />
              <button
                type="submit"
                disabled={newsletterStatus === "loading"}
                className="bg-[#D4AF37] text-[#003366] px-6 py-2 rounded-lg font-bold hover:bg-[#FFD700] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {newsletterStatus === "loading" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#003366] border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Suscribirse
                  </>
                )}
              </button>
            </form>
            {newsletterMessage && (
              <p className={`text-sm ${newsletterStatus === "success" ? "text-green-200" : "text-red-200"}`}>
                {newsletterMessage}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Footer mejorado */}
      <footer className="bg-[#003366] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-heading text-lg mb-4 font-bold">IPA Xerez</h4>
              <p className="text-gray-300 text-sm">Servo per Amikeco - Amistad y Profesionalidad sin Fronteras</p>
            </div>
            <div>
              <h4 className="font-heading text-lg mb-4 font-bold">Enlaces</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Inicio</a></li>
                <li><a href="#beneficios" className="hover:text-[#D4AF37] transition-colors">Beneficios</a></li>
                <li><a href="https://ipa-spain.org" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">IPA España</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-lg mb-4 font-bold">Síguenos</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="https://www.facebook.com/profile.php?id=61572445883496" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">Facebook</a></li>
                <li><a href="https://www.tiktok.com/@ipa.xerez" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">TikTok</a></li>
                <li><a href="https://instagram.com/ipa_xerez" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">Instagram</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-lg mb-4 font-bold">Contacto</h4>
              <p className="text-sm text-gray-300">ipaagrupacionxerez@gmail.com</p>
              <p className="text-sm text-gray-300 mt-2">+34 675 508 110</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 IPA Agrupación Xerez. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
