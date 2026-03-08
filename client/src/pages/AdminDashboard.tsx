import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Users, BookOpen, LogOut } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const [, navigate] = useLocation();

  // Protección: Redirigir si no es admin
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  const adminOptions = [
    {
      icon: BookOpen,
      title: "Gestionar Blog",
      description: "Crear, editar y publicar artículos",
      action: () => navigate("/admin/blog"),
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: "Gestionar Socios",
      description: "Agregar y administrar miembros",
      action: () => navigate("/admin/members"),
      color: "from-green-500 to-green-600"
    },
    {
      icon: FileText,
      title: "Gestionar Documentos",
      description: "Subir y organizar documentación",
      action: () => navigate("/admin/documents"),
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003366] to-[#001a33] text-white py-8 border-b border-[#D4AF37]/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030391939/AgkWeOTDyZirPRUK.png" 
                alt="IPA Xerez" 
                className="h-12 w-auto" 
              />
              <div>
                <h1 className="text-3xl font-bold">Panel de Administración</h1>
                <p className="text-gray-300">IPA Xerez - Gestión Interna</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300">Usuario autenticado</p>
              <p className="font-bold text-lg text-[#D4AF37]">✓ Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {adminOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Card 
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer hover:scale-105 transform"
                onClick={option.action}
              >
                <div className={`bg-gradient-to-br ${option.color} p-8 text-white`}>
                  <Icon className="w-12 h-12 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">{option.title}</h2>
                  <p className="text-white/90">{option.description}</p>
                </div>
                <div className="p-6">
                  <Button 
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#003366] hover:from-[#FFD700] hover:to-[#D4AF37] font-bold"
                    onClick={(e) => {
                      e.stopPropagation();
                      option.action();
                    }}
                  >
                    Acceder →
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <Card className="border-0 shadow-lg bg-white/10 backdrop-blur p-8 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Información Rápida</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <p className="text-gray-300 text-sm mb-2">Módulo</p>
              <p className="text-2xl font-bold text-[#D4AF37]">Blog</p>
              <p className="text-gray-400 text-xs mt-2">Gestión de artículos</p>
            </div>
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <p className="text-gray-300 text-sm mb-2">Módulo</p>
              <p className="text-2xl font-bold text-[#D4AF37]">Socios</p>
              <p className="text-gray-400 text-xs mt-2">Administración de miembros</p>
            </div>
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <p className="text-gray-300 text-sm mb-2">Módulo</p>
              <p className="text-2xl font-bold text-[#D4AF37]">Documentos</p>
              <p className="text-gray-400 text-xs mt-2">Gestión de archivos</p>
            </div>
          </div>
        </Card>

        {/* Logout Button */}
        <div className="flex justify-center">
          <Button 
            onClick={async () => {
              await logout();
              window.location.href = getLoginUrl();
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
