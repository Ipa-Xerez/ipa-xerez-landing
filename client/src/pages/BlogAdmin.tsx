import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Upload, Save, X, Plus, Edit2, Trash2, Eye, Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";

export default function BlogAdmin() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const checkAdminMutation = trpc.admin.isAdmin.useMutation();

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      checkAdminMutation.mutateAsync({ email: user.email }).then(result => {
        setIsAdmin(result);
        setIsCheckingAdmin(false);
      }).catch(() => {
        setIsAdmin(false);
        setIsCheckingAdmin(false);
      });
    } else {
      setIsCheckingAdmin(false);
    }
  }, [isAuthenticated, user?.email]);
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
  const shareToFacebookMutation = trpc.facebook.sharePost.useMutation();

  // Show loading while checking authentication
  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-800 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-6">Debes estar autenticado para acceder al panel de admin</p>
          <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
            Volver al Inicio
          </Button>
        </div>
      </div>
    );
  }

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-800 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-6">No tienes permisos para acceder al panel de administración</p>
          <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
            Volver al Inicio
          </Button>
        </div>
      </div>
    );
  }

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to S3
  const uploadImage = async () => {
    if (!imageFile) return;

    setIsUploading(true);
    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        try {
          const result = await uploadImageMutation.mutateAsync({
            fileName: imageFile.name,
            fileData: base64Data,
            mimeType: imageFile.type,
          });
          
          setFormData((prev) => ({
            ...prev,
            image: result.url,
          }));
          
          toast.success("Imagen cargada correctamente a S3");
        } catch (error) {
          toast.error("Error al cargar la imagen a S3");
          console.error(error);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(imageFile);
    } catch (error) {
      toast.error("Error al procesar la imagen");
      console.error(error);
      setIsUploading(false);
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

      if (editingId) {
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
      tags: post.tags ? JSON.parse(post.tags).join(", ") : "",
      isPublished: post.isPublished || 1,
    });
    setImagePreview(post.image || "");
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

  // Handle share to Facebook
  const handleShareToFacebook = async (post: any) => {
    try {
      await shareToFacebookMutation.mutateAsync({
        postId: post.id,
        title: post.title,
        excerpt: post.excerpt || post.content.substring(0, 200),
        image: post.image,
        slug: post.slug,
      });
      toast.success("Articulo compartido en Facebook");
    } catch (error) {
      toast.error("Error al compartir en Facebook");
      console.error(error);
    }
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
              onClick={() => navigate("/")}
              variant="outline"
              className="text-white border-white hover:bg-white/20"
            >
              ← Volver
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Create/Edit Form */}
        {isCreating && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? "Editar Artículo" : "Crear Nuevo Artículo"}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título *
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Título del artículo"
                  className="w-full"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slug (URL)
                </label>
                <Input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="slug-del-articulo (se genera automáticamente)"
                  className="w-full"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Resumen (Excerpt)
                </label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Resumen breve del artículo"
                  rows={3}
                  className="w-full"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contenido *
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Contenido del artículo (puedes usar markdown básico)"
                  rows={10}
                  className="w-full font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Tip: Usa saltos de línea para separar párrafos
                </p>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Imagen Destacada
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>
                  {imageFile && (
                    <Button
                      type="button"
                      onClick={uploadImage}
                      disabled={isUploading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? "Subiendo..." : "Subir"}
                    </Button>
                  )}
                </div>

                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-xs h-auto rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Autor
                </label>
                <Input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="Nombre del autor"
                  className="w-full"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoría
                </label>
                <Input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="ej: Eventos, Noticias, Historias"
                  className="w-full"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (separados por comas)
                </label>
                <Input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="tag1, tag2, tag3"
                  className="w-full"
                />
              </div>

              {/* Publish Status */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished === 1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isPublished: e.target.checked ? 1 : 0,
                      })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Publicar ahora
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {createMutation.isPending || updateMutation.isPending
                    ? "Guardando..."
                    : "Guardar Artículo"}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Artículos ({posts.length})
            </h2>
            {!isCreating && (
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Artículo
              </Button>
            )}
          </div>

          {postsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Cargando artículos...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No hay artículos aún</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {post.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {post.category || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            post.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {post.isPublished ? "Publicado" : "Borrador"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(
                          post.publishedAt || post.createdAt
                        ).toLocaleDateString("es-ES")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(post)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleShareToFacebook(post)}
                            disabled={shareToFacebookMutation.isPending}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Compartir en Facebook"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                          <a
                            href={`/blog?search=${encodeURIComponent(post.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Ver en blog"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
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
