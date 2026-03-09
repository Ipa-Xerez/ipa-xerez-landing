import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [showDebug, setShowDebug] = useState(false);

  // Debug: mostrar información del usuario en consola
  useEffect(() => {
    if (user) {
      console.log("[Login] Usuario autenticado:", {
        email: user.email,
        name: user.name,
        role: user.role,
        id: user.id,
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && !loading) {
      console.log("[Login] Redirigiendo a home...");
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

          {user && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800 font-semibold text-sm mb-2">✅ Autenticado como:</p>
              <p className="text-green-700 text-sm">{user.email}</p>
              <p className="text-green-600 text-xs mt-1">Rol: {user.role || "user"}</p>
            </div>
          )}

          <button
            onClick={() => setShowDebug(!showDebug)}
            className="w-full text-xs text-gray-400 hover:text-gray-600 mt-4"
          >
            {showDebug ? "Ocultar" : "Mostrar"} información de debug
          </button>

          {showDebug && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 max-h-40 overflow-y-auto">
              <p>Usuario: {user ? JSON.stringify(user, null, 2) : "No autenticado"}</p>
            </div>
          )}

          <p className="text-gray-500 text-xs text-center mt-6">
            Solo administradores autorizados pueden acceder.
          </p>
        </div>
      </div>
    </div>
  );
}
