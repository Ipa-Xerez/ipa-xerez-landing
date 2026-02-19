import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit2, Trash2, Download, Eye, Filter } from "lucide-react";
import { trpc } from "@/lib/trpc";
import type { PrivateDocument } from "../../../drizzle/schema";

interface DocumentsTableProps {
  documents: PrivateDocument[];
  onRefresh?: () => void;
  isAdmin?: boolean;
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  estatutos: "Estatutos",
  actas: "Actas de Reuniones",
  comunicados: "Comunicados Internos",
  guias: "Guías y Manuales",
  otros: "Otros Documentos",
};

export default function DocumentsTable({
  documents,
  onRefresh,
  isAdmin = false,
}: DocumentsTableProps) {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const deleteDocumentMutation = trpc.documents.delete.useMutation();

  const filteredDocuments = documents.filter((doc) => {
    const matchesType = selectedType === "all" || doc.documentType === selectedType;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este documento?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteDocumentMutation.mutateAsync({ id });
      onRefresh?.();
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Error al eliminar el documento");
    } finally {
      setDeletingId(null);
    }
  };

  const documentTypes = Array.from(new Set(documents.map((d) => d.documentType)));

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-[#003366]" />
          <h3 className="font-semibold text-[#003366]">Filtros</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-semibold text-[#003366] mb-2">
              Buscar por título
            </label>
            <input
              type="text"
              placeholder="Ej: Estatutos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
            />
          </div>

          {/* Filtro por tipo */}
          <div>
            <label className="block text-sm font-semibold text-[#003366] mb-2">
              Tipo de documento
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
            >
              <option value="all">Todos los tipos</option>
              {documentTypes.map((type) => (
                <option key={type} value={type}>
                  {DOCUMENT_TYPE_LABELS[type] || type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Documentos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredDocuments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600 mb-2">No hay documentos disponibles</p>
            <p className="text-sm text-gray-500">
              {searchQuery || selectedType !== "all"
                ? "Intenta cambiar los filtros de búsqueda"
                : "Comienza subiendo un nuevo documento"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#003366] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Título</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Vistas</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Fecha</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-[#003366]">{doc.title}</p>
                        {doc.description && (
                          <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-[#D4AF37]/20 text-[#003366] rounded-full text-sm font-semibold">
                        {DOCUMENT_TYPE_LABELS[doc.documentType] || doc.documentType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Eye className="w-4 h-4" />
                        <span>{doc.viewCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(doc.createdAt).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
                          onClick={() => window.open(doc.fileUrl, "_blank")}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {isAdmin && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-500 text-blue-600 hover:bg-blue-50"
                              disabled
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(doc.id)}
                              disabled={deletingId === doc.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          Mostrando <strong>{filteredDocuments.length}</strong> de{" "}
          <strong>{documents.length}</strong> documentos
        </p>
      </div>
    </div>
  );
}
