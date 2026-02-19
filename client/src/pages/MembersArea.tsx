import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock, LogOut, FileText, Download, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function MembersArea() {
  const [, navigate] = useLocation();
  const [memberNumber, setMemberNumber] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentMember, setCurrentMember] = useState<any>(null);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateMemberMutation = trpc.members.validateMemberNumber.useMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    try {
      const result = await validateMemberMutation.mutateAsync({
        memberNumber: memberNumber.trim(),
      });

      if (result.success && result.member) {
        setCurrentMember(result.member);
        setIsLoggedIn(true);
        setMemberNumber("");
      } else {
        setLoginError(result.message || "Número de socio no válido");
      }
    } catch (error: any) {
      setLoginError(error.message || "Error al validar el número de socio");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentMember(null);
    setMemberNumber("");
    setLoginError("");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#003366] to-[#001a33] flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-[#D4AF37]/10 rounded-full mb-4">
                  <Lock className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h1 className="text-3xl font-bold text-[#003366] mb-2">Zona de Socios</h1>
                <p className="text-gray-600">Acceso exclusivo para miembros de IPA Xerez</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#003366] mb-2">
                    Número de Socio
                  </label>
                  <Input
                    type="text"
                    placeholder="Ej: 12345"
                    value={memberNumber}
                    onChange={(e) => {
                      setMemberNumber(e.target.value);
                      setLoginError("");
                    }}
                    className="border-2 border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Puedes encontrar tu número de socio en tu carnet de IPA
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{loginError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#003366] text-white hover:bg-[#002244] py-6 text-base font-semibold"
                  disabled={isLoading || !memberNumber.trim()}
                >
                  {isLoading ? "Verificando..." : "Acceder"}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  ¿Problemas para acceder? Contacta con la administración de IPA Xerez
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] to-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-[#003366] mb-2">
              Bienvenido, {currentMember?.name}
            </h1>
            <p className="text-gray-600">Número de Socio: {currentMember?.memberNumber}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-2 border-[#D4AF37] text-[#003366] hover:bg-[#D4AF37]/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Tabs/Sections */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Estatutos */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-[#003366] to-[#001a33] text-white">
              <FileText className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-bold mb-2">Estatutos</h3>
              <p className="text-sm text-gray-200 mb-4">
                Reglamentos y normas de funcionamiento de IPA Xerez
              </p>
              <Button
                className="w-full bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F]"
                onClick={() => window.open("https://ipa-international.org/wp-content/uploads/2025/12/IPAHOS1.pdf", "_blank")}
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
            </div>
          </Card>

          {/* Documentos */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-white">
              <FileText className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-bold mb-2">Documentos Privados</h3>
              <p className="text-sm text-gray-100 mb-4">
                Acceso a documentos exclusivos para socios
              </p>
              <Button
                className="w-full bg-white text-[#D4AF37] hover:bg-gray-100 font-semibold"
                disabled
              >
                Próximamente
              </Button>
            </div>
          </Card>

          {/* Directorio */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-[#003366]/80 to-[#D4AF37]/80 text-white">
              <Users className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-bold mb-2">Directorio de Socios</h3>
              <p className="text-sm text-gray-100 mb-4">
                Conecta con otros miembros de IPA Xerez
              </p>
              <Button
                className="w-full bg-white text-[#003366] hover:bg-gray-100 font-semibold"
                disabled
              >
                Próximamente
              </Button>
            </div>
          </Card>
        </div>

        {/* Información de Miembro */}
        <Card className="border-0 shadow-lg">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-[#003366] mb-6">Información de tu Cuenta</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 mb-1">Nombre</p>
                <p className="text-lg font-semibold text-[#003366]">{currentMember?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Número de Socio</p>
                <p className="text-lg font-semibold text-[#003366]">{currentMember?.memberNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Miembro desde</p>
                <p className="text-lg font-semibold text-[#003366]">
                  {currentMember?.createdAt
                    ? new Date(currentMember.createdAt).toLocaleDateString("es-ES")
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Estado</p>
                <p className="text-lg font-semibold text-green-600">✓ Activo</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            ¿Necesitas ayuda? Contacta con la administración de IPA Xerez
          </p>
          <Button
            variant="ghost"
            className="mt-4 text-[#003366] hover:text-[#D4AF37]"
            onClick={() => navigate("/")}
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
