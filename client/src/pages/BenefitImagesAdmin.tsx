import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Trash2, Upload, Edit2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

export default function BenefitImagesAdmin() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    position: "0",
    imageUrl: "",
    imageKey: "",
  });

  // Queries and mutations
  const { data: images = [], refetch } = trpc.benefitImages.getAll.useQuery();
  const createMutation = trpc.benefitImages.create.useMutation();
  const updateMutation = trpc.benefitImages.update.useMutation();
  const deleteMutation = trpc.benefitImages.delete.useMutation();

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Crear FormData para subir el archivo
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);

      // Subir a tu servidor (necesitarás un endpoint para esto)
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          imageUrl: data.url,
          imageKey: data.key,
        }));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.imageUrl) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          name: formData.name,
          description: formData.description,
          imageUrl: formData.imageUrl,
          imageKey: formData.imageKey,
          position: parseInt(formData.position),
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          description: formData.description,
          imageUrl: formData.imageUrl,
          imageKey: formData.imageKey,
          position: parseInt(formData.position),
        });
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        position: "0",
        imageUrl: "",
        imageKey: "",
      });
      setEditingId(null);
      refetch();
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Error al guardar la imagen");
    }
  };

  const handleEdit = (image: any) => {
    setFormData({
      name: image.name,
      description: image.description || "",
      position: image.position.toString(),
      imageUrl: image.imageUrl,
      imageKey: image.imageKey,
    });
    setEditingId(image.id);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta imagen?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        refetch();
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Error al eliminar la imagen");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Gestión de Imágenes de Beneficios</h1>

        {/* Formulario */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingId ? "Editar Imagen" : "Agregar Nueva Imagen"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Viajes e Intercambios"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Posición *</label>
                <Input
                  type="number"
                  min="0"
                  max="3"
                  value={formData.position}
                  onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción de la imagen"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Imagen *</label>
              <div className="flex gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="flex-1"
                />
                {isUploading && <span className="text-sm text-gray-500">Subiendo...</span>}
              </div>
              {formData.imageUrl && (
                <div className="mt-4">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="max-w-xs h-auto rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Upload className="w-4 h-4 mr-2" />
                {editingId ? "Actualizar" : "Agregar"} Imagen
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      name: "",
                      description: "",
                      position: "0",
                      imageUrl: "",
                      imageKey: "",
                    });
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Lista de imágenes */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Imágenes Actuales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={image.imageUrl}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2">{image.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">Posición: {image.position}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(image)}
                      className="flex-1"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(image.id)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
