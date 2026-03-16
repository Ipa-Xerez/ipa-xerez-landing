import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Images, FileText, Users } from "lucide-react";
import BenefitImagesAdmin from "./BenefitImagesAdmin";

export default function AdminPanel() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  // Check if user is admin
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-6">Solo los administradores pueden acceder a esta página.</p>
          <Button onClick={() => navigate("/")} className="w-full">
            Volver al Inicio
          </Button>
        </Card>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <p className="text-sm text-gray-600">Bienvenido, {user?.name || "Admin"}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="benefit-images" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="benefit-images" className="flex items-center gap-2">
              <Images className="w-4 h-4" />
              <span className="hidden sm:inline">Imágenes de Beneficios</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Blog</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Miembros</span>
            </TabsTrigger>
          </TabsList>

          {/* Benefit Images Tab */}
          <TabsContent value="benefit-images">
            <BenefitImagesAdmin />
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Gestión de Blog</h2>
              <p className="text-gray-600">
                La gestión de blog estará disponible próximamente.
              </p>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Gestión de Miembros</h2>
              <p className="text-gray-600">
                La gestión de miembros estará disponible próximamente.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
