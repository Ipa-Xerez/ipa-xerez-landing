import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#003366] to-[#001a33] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003366] to-[#001a33] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <img 
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/AgkWeOTDyZirPRUK.png" 
            alt="IPA Xerez" 
            className="h-16 w-auto mx-auto mb-4" 
          />
          <h1 className="text-3xl font-bold text-[#003366] mb-2">IPA Xerez</h1>
          <p className="text-gray-600">Panel de Administración</p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700 text-center text-sm">
            Inicia sesión con tu cuenta para acceder al panel de administración.
          </p>
          
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            className="w-full bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700] font-bold py-3 text-lg"
          >
            Iniciar Sesión con OAuth
          </Button>

          <p className="text-gray-500 text-xs text-center mt-6">
            Solo administradores autorizados pueden acceder.
          </p>
        </div>
      </div>
    </div>
  );
}
