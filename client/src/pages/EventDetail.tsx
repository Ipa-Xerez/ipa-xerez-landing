import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, ArrowLeft, Share2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

const POLICE_WEEK_POSTER = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/bspODVNHZxCvOkZg.PNG";

export default function EventDetail() {
  const [, params] = useRoute("/evento/:id");
  const [, navigate] = useLocation();
  const eventId = params?.id ? parseInt(params.id) : null;

  // Fetch event details
  const { data: event, isLoading } = trpc.events.getById.useQuery(
    { id: eventId! },
    { enabled: !!eventId }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando evento...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Evento no encontrado</p>
          <Button onClick={() => navigate("/")} className="bg-[#D4AF37] text-[#003366]">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const message = `Hola, me interesa la actividad de ${event.title} del ${new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/34675508110?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003366] to-[#004d99] text-white py-6">
        <div className="container mx-auto px-4">
          <Button 
            onClick={() => navigate("/")}
            className="bg-white/20 text-white hover:bg-white/30 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold">{event.title}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Image */}
          <div className="md:col-span-2">
            <div className="relative h-96 bg-cover bg-center rounded-lg shadow-lg" style={{ backgroundImage: `url(${event.image || POLICE_WEEK_POSTER})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg"></div>
            </div>
          </div>

          {/* Event Details Sidebar */}
          <div className="space-y-6">
            {/* Date Card */}
            <div className="bg-[#F5F5F5] rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">FECHA Y HORA</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#D4AF37] mt-1" />
                  <div>
                    <p className="font-bold text-[#003366]">{new Date(event.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Location Card */}
            <div className="bg-[#F5F5F5] rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">UBICACIÓN</h3>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] mt-1" />
                <div>
                  <p className="font-bold text-[#003366]">{event.location || 'Por confirmar'}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleWhatsApp}
                className="bg-red-600 text-white hover:bg-red-700 font-bold w-full py-6 text-base"
              >
                📞 Me apunto
              </Button>
              <Button 
                onClick={() => {
                  const text = `Mira este evento de IPA Xerez: ${event.title} - ${new Date(event.date).toLocaleDateString('es-ES')}`;
                  const url = window.location.href;
                  navigator.share?.({ title: event.title, text, url }) || 
                  window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                }}
                className="bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700] font-bold w-full py-6 text-base"
              >
                <Share2 className="w-4 h-4 mr-2" /> Compartir
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12 bg-[#F5F5F5] rounded-lg p-8">
          <h2 className="text-2xl font-bold text-[#003366] mb-4">Sobre esta actividad</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {event.description || `Únete a nosotros en ${event.title}. Una experiencia única con IPA Xerez donde compartiremos amistad, profesionalidad y hermandad internacional. No te lo pierdas.`}
          </p>
          <div className="bg-white rounded-lg p-4 border-l-4 border-[#D4AF37]">
            <p className="text-sm text-gray-600">
              <strong>Nota:</strong> Para más información y confirmar tu asistencia, haz clic en el botón "Me apunto" para contactar directamente con nosotros por WhatsApp.
            </p>
          </div>
        </div>

        {/* Related Events */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#003366] mb-6">Otros eventos</h2>
          <Button 
            onClick={() => navigate("/calendario")}
            className="bg-[#003366] text-white hover:bg-[#002244]"
          >
            Ver calendario completo
          </Button>
        </div>
      </div>
    </div>
  );
}
