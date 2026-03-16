import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Images, FileText, Users, Lock } from "lucide-react";
import BenefitImagesAdmin from "./BenefitImagesAdmin";

export default function AdminPanel() {
  const [code, setCode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [, navigate] = useLocation();
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    if (code === "31907") {
      setAuthenticated(true);
      setCode("");
    } else {
      setError("Código incorrecto. Por favor intenta de nuevo.");
      setCode("");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setCode("");
    setError("");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-indigo-600 p-3 rounded-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">Panel de Administración</h1>
          <p className="text-gray-600 text-center mb-6">Ingresa tu código de acceso</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Código de Acceso</label>
              <Input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Ingresa tu código"
                className="w-full"
              />
            </div>

            <Button
              onClick={handleLogin}
              disabled={!code}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Acceder
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              Volver al Inicio
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <p className="text-sm text-gray-600">Administrador conectado</p>
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
            <BenefitImagesAdmin isAdminAuthenticated={authenticated} />
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
