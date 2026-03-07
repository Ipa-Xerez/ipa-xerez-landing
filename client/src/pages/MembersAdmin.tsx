import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, LogOut } from "lucide-react";
import MembersManagement from "@/components/MembersManagement";
import { getLoginUrl } from "@/const";

export default function MembersAdmin() {
  const { user, loading, logout } = useAuth();
  const [, navigate] = useLocation();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#003366] to-[#002244] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-[#003366] mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-6">No tienes permisos para acceder a esta sección.</p>
          <Button
            onClick={() => navigate("/")}
            className="bg-[#003366] hover:bg-[#002244] text-white"
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
    );
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
                onClick={() => navigate("/admin/dashboard")}
                className="text-gray-600 hover:text-[#003366]"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al Panel
              </Button>
              <h1 className="text-3xl font-bold text-[#003366]">Gestión de Socios</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Admin: <span className="font-semibold text-[#003366]">{user.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await logout();
                  window.location.href = getLoginUrl();
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
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
