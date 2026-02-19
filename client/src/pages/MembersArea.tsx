import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock, LogOut, FileText, Download, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import DocumentsTable from "@/components/DocumentsTable";

function EstatutosSection() {
  const estatutosQuery = trpc.documents.getByType.useQuery({ documentType: "estatutos" });

  if (estatutosQuery.isLoading) {
    return (
      <div id="estatutos-section" className="mt-12 scroll-mt-24">
        <h2 className="text-3xl font-bold text-[#003366] mb-8">Estatutos</h2>
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#003366] mb-4"></div>
        <p className="text-gray-600">Cargando estatutos...</p>
      </div>
    );
  }

  return (
    <div id="estatutos-section" className="mt-12 scroll-mt-24">
      <h2 className="text-3xl font-bold text-[#003366] mb-8">Estatutos</h2>
      {estatutosQuery.data && estatutosQuery.data.length > 0 ? (
        <DocumentsTable documents={estatutosQuery.data} isAdmin={false} />
      ) : (
        <Card className="border-0 shadow-lg">
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No hay estatutos disponibles en este momento</p>
            <p className="text-sm text-gray-500">Los administradores pueden subir los estatutos en el panel de control</p>
          </div>
        </Card>
      )}
    </div>
  );
}

function DocumentTypeSection({ type, label }: { type: string; label: string }) {
  const documentsQuery = trpc.documents.getByType.useQuery({ documentType: type });

  if (documentsQuery.isLoading) {
    return (
      <div className="mt-8 text-center py-8">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#003366] mb-2"></div>
        <p className="text-gray-600 text-sm">Cargando {label}...</p>
      </div>
    );
  }

  if (!documentsQuery.data || documentsQuery.data.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-[#003366] mb-6">{label}</h3>
      <DocumentsTable documents={documentsQuery.data} isAdmin={false} />
    </div>
  );
}

function DocumentosPrivadosSection() {
  const documentTypes = [
    { type: "actas_reuniones", label: "Actas de Reuniones" },
    { type: "comunicados_internos", label: "Comunicados Internos" },
    { type: "guias_manuales", label: "Guías y Manuales" },
    { type: "otros_documentos", label: "Otros Documentos" },
  ];

  return (
    <div id="documents-section" className="mt-12 scroll-mt-24">
      <h2 className="text-3xl font-bold text-[#003366] mb-8">Documentos Disponibles</h2>
      <div className="space-y-8">
        {documentTypes.map((docType) => (
          <DocumentTypeSection key={docType.type} type={docType.type} label={docType.label} />
        ))}
      </div>
    </div>
  );
}

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
      } else {
        setLoginError(result.message || "Número de socio no encontrado. Por favor verifica tu número.");
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
    setTimeout(() => navigate("/"), 500);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] to-white flex items-center justify-center pt-24 pb-12">
        <div className="w-full max-w-md px-4">
          <Card className="border-0 shadow-2xl">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/20 mb-4">
                  <Lock className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h1 className="text-3xl font-bold text-[#003366] mb-2">Zona de Socios</h1>
                <p className="text-gray-600">Acceso exclusivo para miembros de IPA Xerez</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#003366] mb-2">
                    Número de Socio
                  </label>
                  <Input
                    type="text"
                    placeholder="Ej: 31907"
                    value={memberNumber}
                    onChange={(e) => setMemberNumber(e.target.value)}
                    className="border-2 border-[#D4AF37] focus:border-[#003366]"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Puedes encontrar tu número de socio en tu carnet de IPA
                  </p>
                </div>

                {loginError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm font-medium">{loginError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#003366] hover:bg-[#001a33] text-white font-bold py-3 text-lg"
                >
                  {isLoading ? "Validando..." : "Acceder"}
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                <p className="text-gray-600 text-sm mb-4">
                  ¿Problemas para acceder? Contacta con la administración de IPA Xerez
                </p>
                <Button
                  variant="ghost"
                  className="text-[#003366] hover:text-[#D4AF37]"
                  onClick={() => navigate("/")}
                >
                  Volver al Inicio
                </Button>
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

        {/* Estatutos */}
        <EstatutosSection />

        {/* Documentos Privados */}
        <DocumentosPrivadosSection />

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
