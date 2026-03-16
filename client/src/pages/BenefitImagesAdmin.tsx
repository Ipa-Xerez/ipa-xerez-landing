import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Trash2, Upload, Edit2, AlertCircle } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

export default function BenefitImagesAdmin() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    position: "0",
  });

  // Queries and mutations
  const { data: images = [], refetch } = trpc.benefitImages.getAll.useQuery();
  const uploadMutation = trpc.benefitImages.uploadImage.useMutation();
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");

    // Validar tipo
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Solo se permiten imágenes (JPEG, PNG, WebP, GIF)");
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("El archivo no puede exceder 5MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name) {
      setError("Por favor completa el nombre");
      return;
    }

    if (!editingId && !selectedFile) {
      setError("Por favor selecciona una imagen");
      return;
    }

    try {
      setIsUploading(true);

      if (editingId) {
        // Actualizar imagen existente
        await updateMutation.mutateAsync({
          id: editingId,
          name: formData.name,
          description: formData.description,
          position: parseInt(formData.position),
        });
        setSuccess("Imagen actualizada correctamente");
      } else if (selectedFile) {
        // Subir nueva imagen
        await uploadMutation.mutateAsync({
          file: selectedFile,
          name: formData.name,
          description: formData.description,
          position: parseInt(formData.position),
        });
        setSuccess("Imagen subida correctamente");
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        position: "0",
      });
      setSelectedFile(null);
      setPreviewUrl("");
      setEditingId(null);
      refetch();
    } catch (error: any) {
      setError(error.message || "Error al guardar la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (image: any) => {
    setFormData({
      name: image.name,
      description: image.description || "",
      position: image.position.toString(),
    });
    setPreviewUrl(image.imageUrl);
    setEditingId(image.id);
    setSelectedFile(null);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta imagen?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        setSuccess("Imagen eliminada correctamente");
        refetch();
      } catch (error: any) {
        setError(error.message || "Error al eliminar la imagen");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      position: "0",
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setEditingId(null);
    setError("");
    setSuccess("");
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

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">{success}</p>
            </div>
          )}

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
                <label className="block text-sm font-medium mb-2">Posición (0-3) *</label>
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

            {!editingId && (
              <div>
                <label className="block text-sm font-medium mb-2">Imagen *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Haz clic para seleccionar una imagen o arrastra y suelta
                      </p>
                      <p className="text-xs text-gray-500">
                        JPEG, PNG, WebP, GIF (máximo 5MB)
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {previewUrl && (
              <div>
                <label className="block text-sm font-medium mb-2">Vista Previa</label>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-xs h-auto rounded-lg border border-gray-200"
                />
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? "Subiendo..." : editingId ? "Actualizar" : "Subir Imagen"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
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
          {images.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">No hay imágenes aún</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {images.map((image: any) => (
                <Card key={image.id} className="overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{image.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Posición: {image.position}
                    </p>
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
          )}
        </div>
      </div>
    </div>
  );
}
