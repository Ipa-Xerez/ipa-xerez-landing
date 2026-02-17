import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

export default function EventsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Fetch events from the database
  const { data: events = [] } = trpc.events.getUpcoming.useQuery();

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || events.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [autoPlay, events.length]);

  const goToPrevious = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const goToNext = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const goToSlide = (index: number) => {
    setAutoPlay(false);
    setCurrentIndex(index);
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No hay eventos próximos en este momento.</p>
      </div>
    );
  }

  const currentEvent = events[currentIndex];

  return (
    <div className="space-y-6">
      {/* Main Carousel */}
      <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
        {/* Event Image */}
        <div className="relative h-96 bg-gray-200 overflow-hidden">
          {currentEvent.image ? (
            <img
              src={currentEvent.image}
              alt={currentEvent.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#003366] to-[#1A3A52]">
              <Calendar className="w-24 h-24 text-[#D4AF37] opacity-50" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Event Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#D4AF37] text-[#003366] px-3 py-1 rounded-full text-sm font-bold">
                {currentEvent.eventType === "police-week"
                  ? "Semana Policial"
                  : currentEvent.eventType === "zambomba"
                  ? "Zambomba"
                  : currentEvent.eventType === "international-trip"
                  ? "Viaje Internacional"
                  : "Evento"}
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-2">{currentEvent.title}</h2>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(currentEvent.date).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
              </div>
              {currentEvent.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{currentEvent.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#003366] rounded-full p-2 transition-all z-10"
            aria-label="Evento anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#003366] rounded-full p-2 transition-all z-10"
            aria-label="Siguiente evento"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Event Details */}
        <div className="p-6">
          {currentEvent.description && (
            <p className="text-gray-700 mb-4 line-clamp-3">{currentEvent.description}</p>
          )}

          <div className="flex flex-wrap gap-3">
            {currentEvent.registrationUrl && (
              <a
                href={currentEvent.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700] px-6 py-2 rounded-lg font-bold transition-colors"
              >
                Registrarse
              </a>
            )}
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className="bg-[#003366] text-white hover:bg-[#1A3A52] px-6 py-2 rounded-lg font-bold transition-colors"
            >
              {autoPlay ? "Pausar" : "Reanudar"}
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center gap-2">
        {events.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-[#D4AF37] w-8"
                : "bg-gray-300 w-3 hover:bg-gray-400"
            }`}
            aria-label={`Ir al evento ${index + 1}`}
          />
        ))}
      </div>

      {/* Events List Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.slice(0, 3).map((event: any, index: number) => (
          <button
            key={event.id}
            onClick={() => goToSlide(index)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              index === currentIndex
                ? "border-[#D4AF37] bg-[#F5F5F5]"
                : "border-gray-200 hover:border-[#D4AF37]"
            }`}
          >
            <div className="flex items-start gap-3">
              <Calendar className={`w-5 h-5 flex-shrink-0 ${
                index === currentIndex ? "text-[#D4AF37]" : "text-gray-400"
              }`} />
              <div className="min-w-0">
                <h3 className="font-bold text-[#003366] text-sm truncate">
                  {event.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {new Date(event.date).toLocaleDateString("es-ES", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* View All Events Button */}
      {events.length > 3 && (
        <div className="text-center">
          <a
            href="/events"
            className="inline-block bg-[#003366] text-white hover:bg-[#1A3A52] px-8 py-3 rounded-lg font-bold transition-colors"
          >
            Ver todos los eventos
          </a>
        </div>
      )}
    </div>
  );
}
