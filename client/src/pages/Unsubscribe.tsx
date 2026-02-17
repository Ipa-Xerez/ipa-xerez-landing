import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function Unsubscribe() {
  const [, navigate] = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const unsubscribeMutation = trpc.newsletter.unsubscribe.useMutation({
    onSuccess: () => {
      setStatus("success");
      setMessage("Te has desuscrito exitosamente. Serás redirigido en 5 segundos...");
      setTimeout(() => navigate("/"), 5000);
    },
    onError: (error) => {
      setStatus("error");
      setMessage(error.message || "Error al desuscribirse. Por favor, intenta de nuevo.");
    },
  });

  useEffect(() => {
    // Obtener el token de la URL
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (!tokenFromUrl) {
      setStatus("error");
      setMessage("Token de desuscripción no encontrado.");
      return;
    }

    setToken(tokenFromUrl);

    // Procesar la desuscripción automáticamente
    unsubscribeMutation.mutate({ token: tokenFromUrl });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#003366] to-[#004d99] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 mx-auto text-[#D4AF37] animate-spin mb-4" />
            <h1 className="text-2xl font-bold text-[#003366] mb-2">Procesando...</h1>
            <p className="text-gray-600">Estamos procesando tu desuscripción.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h1 className="text-2xl font-bold text-[#003366] mb-2">¡Desuscripción Exitosa!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700]"
            >
              Volver al Inicio
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle className="w-16 h-16 mx-auto text-red-600 mb-4" />
            <h1 className="text-2xl font-bold text-[#003366] mb-2">Error</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-2">
              <Button
                onClick={() => navigate("/")}
                className="w-full bg-[#003366] text-white hover:bg-[#002244]"
              >
                Volver al Inicio
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Si continúas teniendo problemas, contacta a nuestro equipo en{" "}
                <a href="mailto:contacto@ipaxerez.com" className="text-[#D4AF37] hover:underline">
                  contacto@ipaxerez.com
                </a>
              </p>
            </div>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            International Police Association - Agrupación Xerez
          </p>
          <p className="text-xs text-gray-500 mt-1">Servo per Amikeco</p>
        </div>
      </Card>
    </div>
  );
}
