import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { useLocation } from "wouter";
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";

interface Event {
  id: string;
  name: string;
  date: string;
  startDate: Date;
  endDate: Date;
  location: string;
  country: string;
  type: "local" | "international";
  description?: string;
  url?: string;
}

export default function Calendar() {
  const [, navigate] = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date()); // Fecha actual
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // Eventos locales de IPA Xerez
  const localEvents: Event[] = [
    {
      id: "police-week",
      name: "Police Week Washington 2026",
      date: "11-17 Mayo 2026",
      startDate: new Date(2026, 4, 11),
      endDate: new Date(2026, 4, 17),
      location: "Washington D.C.",
      country: "USA",
      type: "local",
      description: "Vive una experiencia única con IPA Málaga e IPA Xerez. Honra, hermandad y orgullo policial internacional.",
      url: "https://policeweek.org"
    },
    {
      id: "puy-du-fou",
      name: "Puy du Fou - Especial IPA",
      date: "17-19 Abril 2026",
      startDate: new Date(2026, 3, 17),
      endDate: new Date(2026, 3, 19),
      location: "Torrejón de Ardoz, Francia",
      country: "France",
      type: "local",
      description: "3 días / 2 noches con entrada al Sueño de Toledo, autocar, hotel y todas las excursiones incluidas. 360€ por persona.",
      url: "https://selmaviajes.com/17-04-26-puy-du-fou-especial-ipa/"
    }
  ];

  // Eventos internacionales de IPA (muestra de ejemplo)
  const internationalEvents: Event[] = [
    {
      id: "gimborn-crypto",
      name: "IBZ Gimborn Crypto Fundamentals",
      date: "9-11 Marzo 2026",
      startDate: new Date(2026, 2, 9),
      endDate: new Date(2026, 2, 11),
      location: "Alemania",
      country: "Germany",
      type: "international",
      description: "Seminario sobre criptografía y blockchain para investigadores"
    },
    {
      id: "italy-congress",
      name: "IPA Italy National Congress 2026",
      date: "4-8 Marzo 2026",
      startDate: new Date(2026, 2, 4),
      endDate: new Date(2026, 2, 8),
      location: "Italia",
      country: "Italy",
      type: "international",
      description: "Congreso Nacional de IPA Italia"
    },
    {
      id: "austria-hiking",
      name: "IPA Austria Hiking Week",
      date: "14-21 Junio 2026",
      startDate: new Date(2026, 5, 14),
      endDate: new Date(2026, 5, 21),
      location: "Nassfeld, Austria",
      country: "Austria",
      type: "international",
      description: "Semana de senderismo con IPA Austria"
    },
    {
      id: "peru-friendship",
      name: "IPA Peru Friendship Week",
      date: "2-6 Mayo 2026",
      startDate: new Date(2026, 4, 2),
      endDate: new Date(2026, 4, 6),
      location: "Perú",
      country: "Peru",
      type: "international",
      description: "Semana de amistad en Perú"
    }
  ];

  useEffect(() => {
    // Combinar eventos locales e internacionales
    setEvents([...localEvents, ...internationalEvents]);
    setLoading(false);
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventStart = event.startDate;
      const eventEnd = event.endDate;
      const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthName = currentDate.toLocaleString("es-ES", { month: "long", year: "numeric" });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Agregar celdas vacías al inicio
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Agregar días del mes
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando eventos...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="mb-6">
          <Breadcrumbs items={[{ label: "Calendario", href: "/calendar" }]} />
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-[#003366] text-center mb-4 font-bold">Calendario de Eventos</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Descubre todos los eventos de IPA Xerez e IPA Internacional. Los eventos locales aparecen en azul, los internacionales en verde.</p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendario */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-lg">
              {/* Encabezado del mes */}
              <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" onClick={previousMonth} className="p-2">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="font-heading text-2xl text-[#003366] font-bold capitalize">{monthName}</h2>
                <Button variant="ghost" onClick={nextMonth} className="p-2">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Días de la semana */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sab", "Dom"].map(day => (
                  <div key={day} className="text-center font-bold text-gray-600 py-2 text-sm">
                    {day}
                  </div>
                ))}
              </div>

              {/* Días del calendario */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                  const dayEvents = day ? getEventsForDay(day) : [];
                  const hasLocalEvent = dayEvents.some(e => e.type === "local");
                  const hasIntlEvent = dayEvents.some(e => e.type === "international");
                  const today = new Date();
                  const isToday = day && day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

                  return (
                    <div
                      key={idx}
                      className={`aspect-square p-2 rounded-lg border-2 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                        !day
                          ? "bg-gray-50 border-gray-100"
                          : isToday
                          ? "bg-[#D4AF37] border-[#B8860B] hover:bg-[#C4991F] font-bold"
                          : hasLocalEvent
                          ? "bg-blue-100 border-blue-400 hover:bg-blue-200"
                          : hasIntlEvent
                          ? "bg-green-100 border-green-400 hover:bg-green-200"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        if (dayEvents.length > 0) {
                          setSelectedEvent(dayEvents[0]);
                        }
                      }}
                    >
                      {day && (
                        <>
                          <span className="font-bold text-sm">{day}</span>
                          {dayEvents.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {hasLocalEvent && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                              {hasIntlEvent && <div className="w-2 h-2 bg-green-600 rounded-full"></div>}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Leyenda */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex gap-6 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded"></div>
                  <span>Eventos IPA Xerez</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                  <span>Eventos IPA Internacional</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Panel de detalles */}
          <div>
            <Card className="p-6 shadow-lg sticky top-24">
              <h3 className="font-heading text-xl text-[#003366] mb-4 font-bold">
                {selectedEvent ? "Detalles del Evento" : "Selecciona un evento"}
              </h3>

              {selectedEvent ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-[#003366] mb-1">{selectedEvent.name}</h4>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      selectedEvent.type === "local" ? "bg-blue-600" : "bg-green-600"
                    }`}>
                      {selectedEvent.type === "local" ? "IPA Xerez" : "IPA Internacional"}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-700">{selectedEvent.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-700">{selectedEvent.location}</p>
                      <p className="text-gray-600">{selectedEvent.country}</p>
                    </div>
                  </div>

                  {selectedEvent.description && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-700">{selectedEvent.description}</p>
                    </div>
                  )}

                  {selectedEvent.url && (
                    <a
                      href={selectedEvent.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-[#D4AF37] text-[#003366] px-4 py-2 rounded font-semibold text-center hover:bg-[#C4991F] transition-colors text-sm"
                    >
                      Más Información
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">
                  Haz clic en un día con evento (marcado con puntos de color) para ver los detalles.
                </div>
              )}

              {/* Lista de próximos eventos */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="font-bold text-[#003366] mb-4">Próximos Eventos</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {events
                    .filter(e => e.startDate >= currentDate)
                    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                    .slice(0, 5)
                    .map(event => (
                      <div
                        key={event.id}
                        className="p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <p className="font-semibold text-sm text-[#003366] line-clamp-2">{event.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{event.date}</p>
                      </div>
                    ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
