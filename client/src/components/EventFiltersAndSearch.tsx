import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, List, Calendar } from "lucide-react";

interface Event {
  id: number;
  title: string;
  description?: string;
  date: Date;
  location?: string;
  eventType: string;
}

interface EventFiltersAndSearchProps {
  events: Event[];
  onFilteredEventsChange?: (events: Event[]) => void;
}

export default function EventFiltersAndSearch({
  events,
  onFilteredEventsChange,
}: EventFiltersAndSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(events.map((e) => e.eventType));
    return Array.from(cats);
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        searchQuery === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === null || event.eventType === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, selectedCategory]);

  // Notify parent of filtered events
  if (onFilteredEventsChange) {
    onFilteredEventsChange(filteredEvents);
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Buscar eventos por título, descripción o ubicación..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
          className={
            selectedCategory === null
              ? "bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F]"
              : ""
          }
        >
          Todos ({events.length})
        </Button>

        {categories.map((category) => {
          const count = events.filter((e) => e.eventType === category).length;
          return (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F]"
                  : ""
              }
            >
              {category} ({count})
            </Button>
          );
        })}
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === "calendar" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("calendar")}
          className={
            viewMode === "calendar"
              ? "bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F]"
              : ""
          }
        >
          <Calendar className="w-4 h-4 mr-2" />
          Calendario
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("list")}
          className={
            viewMode === "list"
              ? "bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F]"
              : ""
          }
        >
          <List className="w-4 h-4 mr-2" />
          Lista
        </Button>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Mostrando {filteredEvents.length} de {events.length} eventos
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {filteredEvents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No se encontraron eventos que coincidan con tu búsqueda.
            </p>
          ) : (
            filteredEvents
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
              .map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-[#003366]">
                      {event.title}
                    </h3>
                    <span className="text-xs bg-[#D4AF37] text-[#003366] px-2 py-1 rounded">
                      {event.eventType}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {event.description}
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>
                      📅{" "}
                      {new Date(event.date).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {event.location && <p>📍 {event.location}</p>}
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
}
