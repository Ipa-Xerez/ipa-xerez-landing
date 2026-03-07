import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, LogOut } from "lucide-react";
import MembersManagement from "@/components/MembersManagement";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

export default function MembersAdmin() {
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    try {
      await trpc.auth.logout.useMutation().mutateAsync();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      window.location.href = getLoginUrl();
    }
  };

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
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
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
