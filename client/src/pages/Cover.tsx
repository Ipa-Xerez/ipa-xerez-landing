import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const COVER_IMAGE = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/WdCcjBwVsNlQtuaX.jpg";

export default function Cover() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  const handleEnter = () => {
    navigate("/home");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${COVER_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay oscuro opcional para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Contenido */}
      <div className="relative z-10 text-center px-4">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
            Bienvenido a IPA Xerez
          </h1>
          <p className="text-xl md:text-2xl text-white drop-shadow-md">
            Amistad, Profesionalidad y Hermandad Internacional
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              onClick={handleEnter}
              className="bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700] text-lg px-10 py-6 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Entrar al Sitio
            </Button>

            {!isAuthenticated && (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                variant="outline"
                className="text-white border-2 border-white hover:bg-white/20 text-lg px-10 py-6 font-bold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
              >
                Acceso de Socios
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
