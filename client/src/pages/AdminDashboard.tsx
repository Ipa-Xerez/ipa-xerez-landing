import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { LogOut, Plus, Trash2, Upload, ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";

const toast = (options: { title: string; description?: string; variant?: string }) => {
  console.log(options.variant === "destructive" ? "❌" : "✅", options.title, options.description || "");
};

const ADMIN_EMAIL = "ipaagrupacionxerez@gmail.com";

export default function AdminDashboard() {
  const { user, logout, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"blog" | "members" | "documents">("blog");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    imageUrl: "",
    tags: "",
  });

  // Queries
  const { data: posts = [], refetch: refetchPosts } = trpc.blog.getAll.useQuery();
  const { data: members = [] } = trpc.members.getAll.useQuery();
  const { data: documents = [] } = trpc.documents.getAll.useQuery();

  // Mutations
  const createPostMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast({ title: "✅ Artículo creado exitosamente" });
      setFormData({ title: "", excerpt: "", content: "", category: "", imageUrl: "", tags: "" });
      setShowCreateForm(false);
      refetchPosts();
    },
    onError: (error) => {
      toast({ title: "❌ Error al crear artículo", description: error.message, variant: "destructive" });
    },
  });

  const uploadImageMutation = trpc.blog.uploadImage.useMutation({
    onSuccess: (data) => {
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      toast({ title: "✅ Imagen subida correctamente" });
    },
    onError: (error) => {
      toast({ title: "❌ Error al subir imagen", description: error.message, variant: "destructive" });
    },
  });

  const deletePostMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast({ title: "✅ Artículo eliminado" });
      refetchPosts();
    },
    onError: (error) => {
      toast({ title: "❌ Error al eliminar", description: error.message, variant: "destructive" });
    },
  });

  // Verificar si es admin
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.email || user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-lg p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">Acceso Denegado</h1>
          <p className="text-slate-300 mb-6">No tienes permisos para acceder al panel de administración.</p>
          <Button 
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const handleCreatePost = async () => {
    if (!formData.title || !formData.content) {
      toast({ title: "❌ Completa título y contenido", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await createPostMutation.mutateAsync({
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        image: formData.imageUrl,
        tags: formData.tags.split(",").map((t) => t.trim()),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      await uploadImageMutation.mutateAsync({ fileName: file.name, fileData: base64, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/")}
              className="text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-300">
              <p className="font-semibold text-white">{user?.name || user?.email}</p>
              <p className="text-xs">✓ Administrador</p>
            </div>
            <Button 
              variant="destructive"
              size="sm"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 flex gap-4">
          {(["blog", "members", "documents"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold transition-colors ${
                activeTab === tab
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              {tab === "blog" && "Blog"}
              {tab === "members" && "Socios"}
              {tab === "documents" && "Documentos"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "blog" && (
          <div className="space-y-6">
            {/* Create Post Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Artículos del Blog</h2>
              <Button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Nuevo Artículo
              </Button>
            </div>

            {/* Create Form */}
            {showCreateForm && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Crear Nuevo Artículo</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Título"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Extracto"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 outline-none"
                  />
                  <textarea
                    placeholder="Contenido"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Categoría"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Tags (separados por coma)"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 outline-none"
                  />

                  {/* Image Upload */}
                  <div className="border-2 border-dashed border-slate-600 rounded p-4 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      variant="ghost"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full gap-2 text-slate-300 hover:text-white"
                    >
                      <Upload className="w-4 h-4" />
                      Subir Imagen
                    </Button>
                    {formData.imageUrl && (
                      <div className="mt-2">
                        <img src={formData.imageUrl} alt="Preview" className="max-h-32 mx-auto rounded" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreatePost}
                      disabled={isSubmitting}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? "Creando..." : "Crear Artículo"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-3">
              {posts.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No hay artículos aún</p>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{post.title}</h4>
                      <p className="text-sm text-slate-400">{post.excerpt}</p>
                      {post.category && <p className="text-xs text-slate-500 mt-1">📁 {post.category}</p>}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deletePostMutation.mutate({ id: post.id })}
                      className="gap-2 ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="text-slate-300">
            <h2 className="text-xl font-bold text-white mb-4">Socios IPA</h2>
            <p className="text-sm">Total de socios: {members.length}</p>
            <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
              {members.slice(0, 20).map((member) => (
                <div key={member.id} className="bg-slate-800 p-3 rounded border border-slate-700">
                  <p className="font-semibold text-white">{member.fullName}</p>
                  <p className="text-xs text-slate-400">#{member.memberNumber}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="text-slate-300">
            <h2 className="text-xl font-bold text-white mb-4">Documentos</h2>
            <p className="text-sm">Total de documentos: {documents.length}</p>
            <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
              {documents.slice(0, 20).map((doc) => (
                <div key={doc.id} className="bg-slate-800 p-3 rounded border border-slate-700">
                  <p className="font-semibold text-white">{doc.title}</p>
                  <p className="text-xs text-slate-400">{doc.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
