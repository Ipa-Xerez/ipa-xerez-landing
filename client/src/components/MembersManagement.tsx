import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function MembersManagement() {
  const [memberNumber, setMemberNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const membersQuery = trpc.members.getAll.useQuery();
  const { data: members, refetch, error: membersError, isLoading } = membersQuery;
  
  // Debug logging
  console.log('[MembersManagement] Query state:', { members, isLoading, error: membersError });
  const createMutation = trpc.members.create.useMutation();
  const deleteMutation = trpc.members.delete.useMutation();

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!memberNumber.trim() || !fullName.trim()) {
      alert("Por favor rellena todos los campos");
      return;
    }

    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({
        memberNumber: memberNumber.trim(),
        fullName: fullName.trim(),
      });
      setMemberNumber("");
      setFullName("");
      refetch();
    } catch (error) {
      console.error("Error creating member:", error);
      alert("Error al crear el socio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este socio?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({ id });
      refetch();
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Error al eliminar el socio");
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulario para agregar socio */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-[#003366] mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Agregar Nuevo Socio
        </h3>
        <form onSubmit={handleAddMember} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#003366] mb-2">
                Número de Socio
              </label>
              <input
                type="text"
                value={memberNumber}
                onChange={(e) => setMemberNumber(e.target.value)}
                placeholder="Ej: IPA-001"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#003366] mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej: Juan García López"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F] font-semibold"
          >
            {isSubmitting ? "Guardando..." : "Agregar Socio"}
          </Button>
        </form>
      </div>

      {/* Lista de socios */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-[#003366]">Socios Registrados</h3>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#003366] mb-4"></div>
            <p className="text-gray-600">Cargando socios...</p>
          </div>
        ) : membersError ? (
          <div className="p-8 text-center bg-red-50 border border-red-200">
            <p className="text-red-700 font-semibold mb-2">Error al cargar socios</p>
            <p className="text-red-600 text-sm mb-4">{membersError.message}</p>
            <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700 text-white">
              Reintentar
            </Button>
          </div>
        ) : !members || members.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No hay socios registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#003366] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Número de Socio</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Fecha de Registro</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members.map((member: any) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-[#003366]">{member.memberNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700">{member.fullName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        {member.status === "active" ? "Activo" : member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(member.createdAt).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {members && members.length > 0 && (
          <div className="bg-blue-50 border-t border-blue-200 p-4">
            <p className="text-sm text-blue-700">
              Total de socios: <strong>{members.length}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
