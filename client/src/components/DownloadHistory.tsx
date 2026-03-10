import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, Download, User, Mail, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DownloadHistoryProps {
  documentId?: number;
  showAllDownloads?: boolean;
}

export default function DownloadHistory({ documentId, showAllDownloads = false }: DownloadHistoryProps) {
  const { data: downloads, isLoading, error } = showAllDownloads
    ? trpc.downloads.getAllDownloadsHistory.useQuery()
    : trpc.downloads.getDocumentDownloads.useQuery(
        { documentId: documentId || 0 },
        { enabled: !!documentId }
      );

  const { data: stats } = documentId
    ? trpc.downloads.getDownloadStats.useQuery({ documentId })
    : { data: null };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#003366]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error al cargar el historial de descargas
      </div>
    );
  }

  if (!downloads || downloads.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-600">
        <Download className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p>No hay descargas registradas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Estadísticas */}
      {stats && documentId && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="text-sm text-gray-600">Total de Descargas</div>
            <div className="text-3xl font-bold text-[#003366]">{stats.totalDownloads}</div>
          </Card>
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-sm text-gray-600">Socios Únicos</div>
            <div className="text-3xl font-bold text-green-700">{stats.uniqueMembers}</div>
          </Card>
        </div>
      )}

      {/* Tabla de descargas */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[#003366]">
              <th className="text-left py-3 px-4 font-semibold text-[#003366]">Socio</th>
              <th className="text-left py-3 px-4 font-semibold text-[#003366]">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-[#003366]">Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            {downloads.map((download) => (
              <tr key={download.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{download.memberName}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{download.memberEmail}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {format(new Date(download.downloadedAt), "dd MMM yyyy HH:mm", { locale: es })}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Información adicional */}
      <div className="text-xs text-gray-500 text-center pt-4">
        Total de registros: {downloads.length}
      </div>
    </div>
  );
}
