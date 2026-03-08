import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import MembersManagement from "@/components/MembersManagement";
import { trpc } from "@/lib/trpc";


export default function MembersAdmin() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  // Usar useEffect para navegar, no en render
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  // Mostrar pantalla de carga mientras se verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] mb-4"></div>
          <p className="text-lg text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no es admin, no renderizar nada (useEffect redirige)
  if (!user || user.role !== "admin") {
    return null;
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin")}
                className="text-gray-600 hover:text-[#003366]"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al Panel
              </Button>
              <h1 className="text-3xl font-bold text-[#003366]">Gestión de Socios</h1>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-[#003366] mb-6">
            Administración de Socios
          </h2>
          <MembersManagement />
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Información sobre Socios</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ Aquí puedes agregar, editar y eliminar socios de IPA Xerez</li>
            <li>✓ Cada socio tiene acceso a los documentos privados de la asociación</li>
            <li>✓ Se registran automáticamente los datos de contacto de cada socio</li>
            <li>✓ Puedes cambiar el estado de un socio en cualquier momento</li>
            <li>✓ Los socios eliminados pierden acceso a los documentos privados</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
