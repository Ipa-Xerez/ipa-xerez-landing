import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface EventRegistrationFormProps {
  eventId: number;
  eventTitle: string;
  onSuccess?: () => void;
}

export default function EventRegistrationForm({
  eventId,
  eventTitle,
  onSuccess,
}: EventRegistrationFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const registerMutation = trpc.eventRegistrations.register.useMutation({
    onSuccess: () => {
      toast.success("¡Inscripción confirmada! Revisa tu correo para más detalles.");
      setFormData({ name: "", email: "", phone: "" });
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Error al inscribirse al evento");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({
      eventId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F]"
      >
        Inscribirse
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-[#003366] mb-2">Inscribirse</h2>
        <p className="text-gray-600 mb-6">{eventTitle}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <Input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+34 600 000 000"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="flex-1 bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F]"
            >
              {registerMutation.isPending ? "Inscribiendo..." : "Confirmar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
