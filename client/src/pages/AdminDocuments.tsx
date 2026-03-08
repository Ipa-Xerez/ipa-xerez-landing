import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import DocumentUpload from "@/components/DocumentUpload";
import DocumentsTable from "@/components/DocumentsTable";
import { trpc } from "@/lib/trpc";


export default function AdminDocuments() {
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

  const [showUploadForm, setShowUploadForm] = useState(false);

  const documentsQuery = trpc.documents.getAll.useQuery();



  const handleUploadSuccess = () => {
    setShowUploadForm(false);
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
                onClick={() => navigate("/admin")}
                className="text-gray-600 hover:text-[#003366]"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al Panel
              </Button>
              <h1 className="text-3xl font-bold text-[#003366]">Gestión de Documentos</h1>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Documentos Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#003366]">Documentos Disponibles</h2>
            <Button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F]"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showUploadForm ? "Cancelar" : "Subir Documento"}
            </Button>
          </div>

          {/* Upload Form */}
          {showUploadForm && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <DocumentUpload onSuccess={handleUploadSuccess} />
            </div>
          )}

          {/* Documents List */}
          {documentsQuery.isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#003366] mb-4"></div>
              <p className="text-gray-600">Cargando documentos...</p>
            </div>
          ) : documentsQuery.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700 font-semibold mb-4">Error al cargar documentos</p>
              <p className="text-red-600 text-sm mb-4">{documentsQuery.error.message}</p>
              <Button
                onClick={() => documentsQuery.refetch()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Reintentar
              </Button>
            </div>
          ) : documentsQuery.data && documentsQuery.data.length > 0 ? (
            <DocumentsTable
              documents={documentsQuery.data}
              onRefresh={() => documentsQuery.refetch()}
              isAdmin={true}
            />
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-600 mb-4 text-lg">No hay documentos todavía</p>
              <p className="text-gray-500 text-sm mb-6">Comienza subiendo tu primer documento</p>
              <Button
                onClick={() => setShowUploadForm(true)}
                className="bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Subir Primer Documento
              </Button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Información sobre Documentos</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ Los documentos se almacenan de forma segura en la nube</li>
            <li>✓ Solo los miembros de IPA Xerez pueden acceder a documentos privados</li>
            <li>✓ Se registra automáticamente cada acceso a los documentos</li>
            <li>✓ Puedes cambiar la visibilidad de los documentos en cualquier momento</li>
            <li>✓ Los documentos eliminados no se pueden recuperar</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
