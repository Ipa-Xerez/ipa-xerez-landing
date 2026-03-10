import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Trash2, Edit2, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";

const ADMIN_CODE = "31907";

interface BlogArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string | null;
  category: string;
  tags: string;
  createdAt: Date;
}

export default function AdminBlog() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [code, setCode] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    imageUrl: "",
  });

  // tRPC queries and mutations
  const { data: articles, refetch } = trpc.blog.getAll.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      refetch();
      resetForm();
    },
  });

  const updateMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      refetch();
      resetForm();
    },
  });

  const deleteMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === ADMIN_CODE) {
      setIsAuthenticated(true);
      setCode("");
    } else {
      alert("Código incorrecto");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCode("");
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      tags: "",
      imageUrl: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      alert("Título y contenido son requeridos");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          imageUrl: formData.imageUrl || null,
          category: formData.category,
          tags: formData.tags,
        });
        alert("Artículo actualizado");
      } else {
        await createMutation.mutateAsync({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          imageUrl: formData.imageUrl || null,
          category: formData.category,
          tags: formData.tags,
        });
        alert("Artículo creado");
      }
    } catch (error) {
      alert("Error al guardar el artículo");
      console.error(error);
    }
  };

  const handleEdit = (article: BlogArticle) => {
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      tags: article.tags,
      imageUrl: article.imageUrl || "",
    });
    setEditingId(article.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este artículo?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        alert("Artículo eliminado");
      } catch (error) {
        alert("Error al eliminar el artículo");
        console.error(error);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      alert("Imagen subida correctamente");
    } catch (error) {
      alert("Error al subir la imagen");
      console.error(error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#003366] to-[#001a33] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-3xl font-bold text-[#003366] mb-6 text-center">
            Panel de Blog
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Acceso
              </label>
              <Input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ingresa el código"
                className="text-center text-2xl tracking-widest"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700]"
            >
              Acceder
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#003366]">Panel de Blog</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            Cerrar Sesión
          </Button>
        </div>

        {/* Botón Nuevo Artículo */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="mb-6 bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Artículo
          </Button>
        )}

        {/* Formulario */}
        {showForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#003366] mb-6">
              {editingId ? "Editar Artículo" : "Crear Nuevo Artículo"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Título del artículo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extracto
                </label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      excerpt: e.target.value,
                    }))
                  }
                  placeholder="Breve descripción del artículo"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido *
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="Contenido del artículo"
                  rows={10}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <Input
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    placeholder="Ej: Noticias, Eventos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <Input
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tags: e.target.value }))
                    }
                    placeholder="Ej: ipa, jerez, policía"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen
                </label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                </div>
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700]"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingId ? "Actualizar" : "Crear"} Artículo
                </Button>
                <Button
                  type="button"
                  onClick={resetForm}
                  variant="outline"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Lista de Artículos */}
        <div>
          <h2 className="text-2xl font-bold text-[#003366] mb-4">
            Artículos ({articles?.length || 0})
          </h2>
          {articles && articles.length > 0 ? (
            <div className="grid gap-4">
              {articles.map((article) => (
                <Card key={article.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#003366]">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-gray-600 text-sm mt-1">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex gap-2 mt-2">
                        {article.category && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {article.category}
                          </span>
                        )}
                        {article.tags && (
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {article.tags}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          handleEdit(article as unknown as BlogArticle)
                        }
                        size="sm"
                        variant="outline"
                        className="text-blue-600 border-blue-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(article.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-gray-500">
              No hay artículos. ¡Crea el primero!
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
