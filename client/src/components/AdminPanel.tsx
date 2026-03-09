import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { LogOut, X, Plus, Edit2, Trash2, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";

const toast = (options: { title: string; description?: string; variant?: string }) => {
  console.log(options.variant === "destructive" ? "❌" : "✅", options.title, options.description || "");
};

const ADMIN_EMAIL = "ipaagrupacionxerez@gmail.com";

export default function AdminPanel() {
  const { user, logout } = useAuth();
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
    onSuccess: (result) => {
      setFormData(prev => ({ ...prev, imageUrl: result.url }));
      toast({ title: "✅ Imagen subida exitosamente" });
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

  // Verificar si es admin (case-insensitive)
  const isAdmin = user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  if (!isAdmin) {
    return null;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const base64Data = base64.split(",")[1];
      
      await uploadImageMutation.mutateAsync({
        fileName: file.name,
        fileData: base64Data,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast({ title: "❌ Error", description: "Título y contenido son requeridos", variant: "destructive" });
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
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : [],
        isPublished: 1,
        publishedAt: new Date(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-md">
      <div className="bg-white rounded-lg shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#003366]">Panel Admin</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await logout();
              window.location.href = "/";
            }}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b">
          <button
            onClick={() => setActiveTab("blog")}
            className={`px-3 py-2 text-sm font-semibold ${
              activeTab === "blog"
                ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                : "text-gray-600"
            }`}
          >
            Blog ({posts?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-3 py-2 text-sm font-semibold ${
              activeTab === "members"
                ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                : "text-gray-600"
            }`}
          >
            Socios ({members?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-3 py-2 text-sm font-semibold ${
              activeTab === "documents"
                ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                : "text-gray-600"
            }`}
          >
            Docs ({documents?.length || 0})
          </button>
        </div>

        {/* Content */}
        <div className="text-sm text-gray-700 mb-4 max-h-64 overflow-y-auto">
          {activeTab === "blog" && (
            <div>
              {!showCreateForm ? (
                <>
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="w-full mb-4 bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700]"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Artículo
                  </Button>
                  <p className="font-semibold mb-2">Últimos artículos:</p>
                  {posts?.slice(0, 5).map((post: any) => (
                    <div key={post.id} className="flex justify-between items-start mb-2 p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-800">{post.title}</p>
                        <p className="text-xs text-gray-500">{new Date(post.publishedAt).toLocaleDateString("es-ES")}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePostMutation.mutate(post.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </>
              ) : (
                <form onSubmit={handleCreatePost} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold">Título *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-2 py-1 text-xs border rounded"
                      placeholder="Título del artículo"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Extracto</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      className="w-full px-2 py-1 text-xs border rounded"
                      placeholder="Breve descripción"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Contenido *</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full px-2 py-1 text-xs border rounded"
                      placeholder="Contenido del artículo"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Categoría</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-2 py-1 text-xs border rounded"
                      placeholder="Ej: Viajes, Eventos"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Tags (separados por coma)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-2 py-1 text-xs border rounded"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Imagen</label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        disabled={uploadImageMutation.isPending}
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        {uploadImageMutation.isPending ? "Subiendo..." : "Subir"}
                      </Button>
                    </div>
                    {formData.imageUrl && (
                      <p className="text-xs text-green-600 mt-1">✓ Imagen subida</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1 bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700]"
                      size="sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creando..." : "Crear"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      variant="outline"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
          {activeTab === "members" && (
            <div>
              <p className="font-semibold mb-2">Total de socios: {members?.length}</p>
              <p className="text-xs text-gray-600">
                Gestiona los miembros de IPA Xerez
              </p>
            </div>
          )}
          {activeTab === "documents" && (
            <div>
              <p className="font-semibold mb-2">Total de documentos: {documents?.length}</p>
              <p className="text-xs text-gray-600">
                Documentos privados disponibles
              </p>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 text-center">
          Admin: {user.email}
        </p>
      </div>
    </div>
  );
}
