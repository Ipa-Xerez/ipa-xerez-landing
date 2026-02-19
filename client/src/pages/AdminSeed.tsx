import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Database, CheckCircle, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminSeed() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [isSeeding, setIsSeeding] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const seedMembersMutation = trpc.members.seedMembers.useMutation();

  // Redirigir si no es admin
  if (!loading && (!user || user.role !== "admin")) {
    navigate("/");
    return null;
  }

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

  const handleSeedMembers = async () => {
    setIsSeeding(true);
    setError("");
    setResult(null);

    try {
      const response = await seedMembersMutation.mutateAsync();
      setResult(response);
    } catch (err: any) {
      setError(err.message || "Error al importar socios");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-8 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-[#003366] mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>
          <h1 className="text-4xl font-bold text-[#003366]">Importar Socios</h1>
          <p className="text-gray-600 mt-2">
            Importa los datos de socios desde el archivo JSON a la base de datos
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-0 shadow-lg max-w-2xl">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#003366]/10 rounded-lg">
                <Database className="w-8 h-8 text-[#003366]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#003366]">
                  Base de Datos de Socios
                </h2>
                <p className="text-gray-600 text-sm">
                  Sincroniza los datos del archivo JSON con la base de datos
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Este proceso importará todos los socios desde el archivo
                <code className="bg-blue-100 px-2 py-1 rounded mx-1">socios_ipa_xerez.json</code>
                a la tabla <code className="bg-blue-100 px-2 py-1 rounded mx-1">ipa_members</code>.
                Los socios duplicados serán omitidos automáticamente.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {result && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900 mb-2">
                      Importación completada
                    </p>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>
                        ✓ Total de socios: <strong>{result.total}</strong>
                      </li>
                      <li>
                        ✓ Importados: <strong>{result.inserted}</strong>
                      </li>
                      <li>
                        ✓ Total en base de datos: <strong>{result.total}</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button
              onClick={handleSeedMembers}
              disabled={isSeeding}
              className="w-full bg-[#003366] text-white hover:bg-[#002244] py-6 text-base font-semibold"
            >
              {isSeeding ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Importando socios...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5 mr-2" />
                  Importar Socios Ahora
                </>
              )}
            </Button>

            {/* Steps */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-[#003366] mb-4">Proceso:</h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#D4AF37] text-[#003366] rounded-full flex items-center justify-center font-semibold text-xs">
                    1
                  </span>
                  <span>Se lee el archivo JSON con los datos de socios</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#D4AF37] text-[#003366] rounded-full flex items-center justify-center font-semibold text-xs">
                    2
                  </span>
                  <span>Se valida cada registro de socio</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#D4AF37] text-[#003366] rounded-full flex items-center justify-center font-semibold text-xs">
                    3
                  </span>
                  <span>Se insertan en la tabla ipa_members</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#D4AF37] text-[#003366] rounded-full flex items-center justify-center font-semibold text-xs">
                    4
                  </span>
                  <span>Se reportan los resultados (insertados, duplicados)</span>
                </li>
              </ol>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
