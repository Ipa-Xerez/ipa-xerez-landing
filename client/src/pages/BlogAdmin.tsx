import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { Upload, Save, X, Plus, Edit2, Trash2, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function BlogAdmin() {
  const [, navigate] = useLocation();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    image: "",
    category: "",
    tags: "",
    isPublished: 1,
  });

  // File upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // Queries and mutations
  const { data: posts = [], isLoading: postsLoading, refetch: refetchPosts } = trpc.blog.getAll.useQuery();
  const createMutation = trpc.blog.create.useMutation();
  const updateMutation = trpc.blog.update.useMutation();
  const deleteMutation = trpc.blog.delete.useMutation();
  const uploadImageMutation = trpc.blog.uploadImage.useMutation();

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño de archivo (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede exceder 5MB");
      return;
    }

    setImageFile(file);
    
    // Generar preview
    const reader = new FileReader();
    reader.onload = () => {
      try {
        setImagePreview(reader.result as string);
      } catch (err) {
        console.error("Error setting preview:", err);
      }
    };
    reader.onerror = () => {
      toast.error("Error al leer la imagen");
    };
    reader.readAsDataURL(file);
  };

  // Upload image to S3
  const uploadImage = async () => {
    if (!imageFile) {
      toast.info("No hay imagen seleccionada");
      return;
    }

    setIsUploading(true);
    
    try {
      // Leer el archivo una sola vez
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          
          const result = await uploadImageMutation.mutateAsync({
            fileName: imageFile.name,
            fileData: base64Data,
            mimeType: imageFile.type,
          });
          
          // Actualizar form con URL de S3
          setFormData((prev) => ({
            ...prev,
            image: result.url,
          }));
          
          // Limpiar estado de carga
          setImageFile(null);
          setImagePreview("");
          setIsUploading(false);
          
          toast.success("Imagen cargada correctamente");
        } catch (error) {
          console.error("Error uploading to S3:", error);
          
          // Fallback: usar data URL si S3 falla
          try {
            setFormData((prev) => ({
              ...prev,
              image: reader.result as string,
            }));
            setImageFile(null);
            setImagePreview("");
            setIsUploading(false);
            
            toast.warning("Imagen guardada localmente (sin S3)");
          } catch (fallbackErr) {
            console.error("Fallback error:", fallbackErr);
            setIsUploading(false);
            toast.error("Error al procesar la imagen");
          }
        }
      };
      
      reader.onerror = () => {
        setIsUploading(false);
        toast.error("Error al leer la imagen");
      };
      
      reader.readAsDataURL(imageFile);
    } catch (error) {
      console.error("Error in uploadImage:", error);
      setIsUploading(false);
      toast.error("Error al procesar la imagen");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("El título es requerido");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("El contenido es requerido");
      return;
    }

    // Imagen es opcional
    if (!formData.image.trim()) {
      const confirmed = window.confirm("¿Guardar artículo sin imagen?");
      if (!confirmed) return;
    }

    try {
      const submitData = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim())
          : [],
        isPublished: formData.isPublished ? 1 : 0,
        publishedAt: new Date(),
      };

      if (editingId !== null) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...submitData,
        });
        toast.success("Artículo actualizado correctamente");
      } else {
        await createMutation.mutateAsync(submitData);
        toast.success("Artículo creado correctamente");
      }

      // Reset form
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        author: "",
        image: "",
        category: "",
        tags: "",
        isPublished: 1,
      });
      setImageFile(null);
      setImagePreview("");
      setIsCreating(false);
      setEditingId(null);

      // Refetch posts
      refetchPosts();
    } catch (error) {
      toast.error("Error al guardar el artículo");
      console.error(error);
    }
  };

  // Handle edit
  const handleEdit = (post: any) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      author: post.author || "",
      image: post.image || "",
      category: post.category || "",
      tags: post.tags?.join(", ") || "",
      isPublished: post.isPublished || 1,
    });
    setEditingId(post.id);
    setIsCreating(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este artículo?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Artículo eliminado correctamente");
      refetchPosts();
    } catch (error) {
      toast.error("Error al eliminar el artículo");
      console.error(error);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      author: "",
      image: "",
      category: "",
      tags: "",
      isPublished: 1,
    });
    setImageFile(null);
    setImagePreview("");
    setIsCreating(false);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">📝 Admin Blog</h1>
              <p className="text-blue-100">Gestiona los artículos del blog de IPA Xerez</p>
            </div>
            <Button
              onClick={() => navigate("/admin")}
              variant="outline"
              className="text-white border-white hover:bg-white/20"
            >
              ← Volver al Panel
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Create/Edit Form */}
        {isCreating && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Editar Artículo" : "Crear Nuevo Artículo"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Título *</label>
                <Input
                  type="text"
                  placeholder="Título del artículo"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-2">Slug (URL)</label>
                <Input
                  type="text"
                  placeholder="slug-del-articulo (se genera automáticamente)"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium mb-2">Resumen (Excerpt)</label>
                <Textarea
                  placeholder="Resumen breve del artículo"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  rows={3}
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">Contenido *</label>
                <Textarea
                  placeholder="Contenido del artículo (puedes usar markdown básico)"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, content: e.target.value }))
                  }
                  rows={8}
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Tip: Usa saltos de línea para separar párrafos
                </p>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium mb-2">Imagen Destacada</label>
                <div className="flex gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Button
                    type="button"
                    onClick={uploadImage}
                    disabled={!imageFile || isUploading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Subir
                      </>
                    )}
                  </Button>
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-xs h-auto rounded"
                    />
                  </div>
                )}
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium mb-2">Autor</label>
                <Input
                  type="text"
                  placeholder="Nombre del autor"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, author: e.target.value }))
                  }
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Categoría</label>
                <Input
                  type="text"
                  placeholder="ej: Eventos, Noticias, Historias"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags (separados por comas)</label>
                <Input
                  type="text"
                  placeholder="tag1, tag2, tag3"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                />
              </div>

              {/* Published */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.isPublished === 1}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPublished: e.target.checked ? 1 : 0,
                    }))
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="ml-2 text-sm font-medium">
                  Publicar ahora
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Artículo
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Articles List */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Artículos ({posts.length})
            </h2>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Artículo
            </Button>
          </div>

          {postsLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
              <p className="mt-2 text-gray-600">Cargando artículos...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay artículos publicados aún.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Título</th>
                    <th className="text-left py-3 px-4">Categoría</th>
                    <th className="text-left py-3 px-4">Estado</th>
                    <th className="text-left py-3 px-4">Fecha</th>
                    <th className="text-left py-3 px-4">Facebook</th>
                    <th className="text-left py-3 px-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post: any) => (
                    <tr key={post.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{post.title}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {post.category || "-"}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          {post.isPublished ? "Publicado" : "Borrador"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(post.createdAt).toLocaleDateString("es-ES")}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        No compartido
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(post)}
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(post.id)}
                            title="Eliminar"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/blog/${post.slug}`)}
                            title="Ver en blog"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
