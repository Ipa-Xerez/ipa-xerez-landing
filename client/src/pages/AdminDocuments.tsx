import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Settings } from "lucide-react";
import DocumentUpload from "@/components/DocumentUpload";
import DocumentsTable from "@/components/DocumentsTable";
import { trpc } from "@/lib/trpc";

export default function AdminDocuments() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("documents");
  const [refreshKey, setRefreshKey] = useState(0);

  const documentsQuery = trpc.documents.getAll.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  // Redirigir si no es admin
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, loading, navigate]);

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

  if (!user || user.role !== "admin") {
    return null;
  }

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    documentsQuery.refetch();
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
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-[#003366]"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver
              </Button>
              <h1 className="text-3xl font-bold text-[#003366]">Gestión de Documentos</h1>
            </div>
            <div className="text-sm text-gray-600">
              Admin: <span className="font-semibold text-[#003366]">{user.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white shadow">
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Subir Nuevo
            </TabsTrigger>
          </TabsList>

          {/* Tab: Documentos */}
          <TabsContent value="documents" className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-[#003366] mb-4">
                Documentos Disponibles
              </h2>
              {documentsQuery.isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#003366] mb-4"></div>
                  <p className="text-gray-600">Cargando documentos...</p>
                </div>
              ) : documentsQuery.data ? (
                <DocumentsTable
                  documents={documentsQuery.data}
                  onRefresh={() => documentsQuery.refetch()}
                  isAdmin={true}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No hay documentos disponibles</p>
                  <Button
                    onClick={() => setActiveTab("upload")}
                    className="bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Subir Primer Documento
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab: Subir Documento */}
          <TabsContent value="upload" className="space-y-6">
            <div className="max-w-2xl">
              <DocumentUpload onSuccess={handleUploadSuccess} />
            </div>

            {/* Información de Ayuda */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Información Importante</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>
                  ✓ Los documentos se almacenan de forma segura en la nube
                </li>
                <li>
                  ✓ Solo los miembros de IPA Xerez pueden acceder a documentos privados
                </li>
                <li>
                  ✓ Se registra automáticamente cada acceso a los documentos
                </li>
                <li>
                  ✓ Puedes cambiar la visibilidad de los documentos en cualquier momento
                </li>
                <li>
                  ✓ Los documentos eliminados no se pueden recuperar
                </li>
              </ul>
            </div>

            {/* Tipos de Documentos */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-[#003366] mb-4">Tipos de Documentos Disponibles</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-[#003366]">📋 Estatutos</p>
                  <p className="text-sm text-gray-600 mt-1">Reglamentos y normas de la asociación</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-[#003366]">📝 Actas de Reuniones</p>
                  <p className="text-sm text-gray-600 mt-1">Registros de asambleas y juntas directivas</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-[#003366]">📢 Comunicados Internos</p>
                  <p className="text-sm text-gray-600 mt-1">Avisos y comunicaciones importantes</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-[#003366]">📚 Guías y Manuales</p>
                  <p className="text-sm text-gray-600 mt-1">Documentos de referencia y procedimientos</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
