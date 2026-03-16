import { useState } from "react";
import { trpc } from "../lib/trpc";
import { useLocation } from "wouter";

type TabType = "blog" | "socios" | "documentos" | "galeria";

export default function AdminPanel() {
  const [code, setCode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("blog");

  // Gallery queries and mutations
  const galleryCategories = trpc.gallery.getCategories.useQuery(undefined, { enabled: authenticated });
  const galleryImages = trpc.gallery.getImages.useQuery(undefined, { enabled: authenticated });
  const createGalleryCategory = trpc.gallery.createCategory.useMutation();
  const updateGalleryCategory = trpc.gallery.updateCategory.useMutation();
  const deleteGalleryCategory = trpc.gallery.deleteCategory.useMutation();
  const createGalleryImage = trpc.gallery.createImage.useMutation();
  const deleteGalleryImage = trpc.gallery.deleteImage.useMutation();
  const [, navigate] = useLocation();

  // Blog queries and mutations
  const blogList = trpc.blog.list.useQuery(undefined, { enabled: authenticated });
  const createBlog = trpc.blog.create.useMutation();
  const updateBlog = trpc.blog.update.useMutation();
  const deleteBlog = trpc.blog.delete.useMutation();

  // Members queries and mutations
  const membersList = trpc.members.getAll.useQuery(undefined, { enabled: authenticated });
  const createMember = trpc.members.create.useMutation();
  const updateMember = trpc.members.update.useMutation();
  const deleteMember = trpc.members.delete.useMutation();

  // Documents queries and mutations
  const documentsList = trpc.documents.getAll.useQuery(undefined, { enabled: authenticated });
  const createDocument = trpc.documents.create.useMutation();
  const updateDocument = trpc.documents.update.useMutation();
  const deleteDocument = trpc.documents.delete.useMutation();

  // Blog state
  const [newBlogArticle, setNewBlogArticle] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    image: "",
    slug: "",
  });
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);
  const [blogImagePreview, setBlogImagePreview] = useState<string>("");
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);

  // Members state
  const [newMember, setNewMember] = useState({
    memberNumber: "",
    name: "",
    email: "",
    phone: "",
    joinDate: new Date().toISOString().split("T")[0],
  });
  const [memberImageFile, setMemberImageFile] = useState<File | null>(null);
  const [memberImagePreview, setMemberImagePreview] = useState<string>("");
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);

  // Documents state
  const [newDocument, setNewDocument] = useState({
    title: "",
    description: "",
    documentType: "private",
    url: "",
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [editingDocId, setEditingDocId] = useState<number | null>(null);

  // Gallery state
  const [newGalleryCategory, setNewGalleryCategory] = useState({ name: "" });
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);
  const [galleryImagePreview, setGalleryImagePreview] = useState<string>("");
  const [newGalleryImage, setNewGalleryImage] = useState({ title: "", description: "", image: "" });
  const [editingImageId, setEditingImageId] = useState<number | null>(null);}

  const handleLogin = () => {
    if (code === "31907") {
      setAuthenticated(true);
      setCode("");
    } else {
      alert("Código incorrecto");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setCode("");
    setActiveTab("blog");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  // Blog handlers
  const handleBlogImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen es demasiado grande. Máximo 5MB.");
        return;
      }
      setBlogImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Only use for preview, not for sending to server
        setBlogImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToS3 = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Error al subir imagen');
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw error;
    }
  };

  const cleanText = (text: string): string => {
    if (!text) return "";
    return text.replace(/\r\n/g, "\n").replace(/\n+/g, "\n").trim();
  };

  const handleCreateBlog = async () => {
    if (!newBlogArticle.title.trim()) {
      alert("El título es requerido");
      return;
    }
    if (!newBlogArticle.excerpt.trim()) {
      alert("El extracto es requerido");
      return;
    }
    if (!newBlogArticle.content.trim()) {
      alert("El contenido es requerido");
      return;
    }
    try {
      let imageUrl = newBlogArticle.image;
      
      // Si hay un archivo de imagen, subirlo a S3
      if (blogImageFile) {
        console.log("[Blog] Subiendo imagen a S3...");
        imageUrl = await uploadImageToS3(blogImageFile);
        console.log("[Blog] Imagen subida:", imageUrl);
      }
      
      console.log("[Blog] Enviando datos:", {
        title: newBlogArticle.title.substring(0, 50),
        excerptLen: newBlogArticle.excerpt.length,
        contentLen: newBlogArticle.content.length,
        author: newBlogArticle.author,
        imageUrl: imageUrl,
      });
      await createBlog.mutateAsync({
        title: cleanText(newBlogArticle.title),
        excerpt: cleanText(newBlogArticle.excerpt),
        content: cleanText(newBlogArticle.content),
        author: cleanText(newBlogArticle.author),
        image: imageUrl || "",
      });
      setNewBlogArticle({ title: "", excerpt: "", content: "", author: "", image: "", slug: "" });
      setBlogImageFile(null);
      setBlogImagePreview("");
      blogList.refetch();
      alert("Artículo creado exitosamente");
    } catch (error) {
      console.error("[Blog] Error al crear artículo:", error);
      alert("Error al crear artículo: " + (error instanceof Error ? error.message : "Error desconocido"));
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este artículo?")) {
      try {
        await deleteBlog.mutateAsync({ id });
        blogList.refetch();
        alert("Artículo eliminado exitosamente");
      } catch (error) {
        alert("Error al eliminar artículo");
        console.error(error);
      }
    }
  };

  const handleEditBlog = (blog: any) => {
    setEditingBlogId(blog.id);
    setNewBlogArticle({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author || "",
      image: blog.image || "",
      slug: blog.slug,
    });
    setBlogImagePreview(blog.image || "");
  };

  const handleSaveBlog = async () => {
    if (!editingBlogId) return;
    try {
      let imageUrl = newBlogArticle.image;
      if (blogImageFile) {
        imageUrl = await uploadImageToS3(blogImageFile);
      }
      await updateBlog.mutateAsync({
        id: editingBlogId,
        title: cleanText(newBlogArticle.title),
        excerpt: cleanText(newBlogArticle.excerpt),
        content: cleanText(newBlogArticle.content),
        author: cleanText(newBlogArticle.author),
        image: imageUrl || "",
      });
      setEditingBlogId(null);
      setNewBlogArticle({ title: "", excerpt: "", content: "", author: "", image: "", slug: "" });
      setBlogImageFile(null);
      setBlogImagePreview("");
      blogList.refetch();
      alert("Artículo actualizado exitosamente");
    } catch (error) {
      alert("Error al actualizar artículo");
    }
  };

  const handleCancelEditBlog = () => {
    setEditingBlogId(null);
    setNewBlogArticle({ title: "", excerpt: "", content: "", author: "", image: "", slug: "" });
    setBlogImageFile(null);
    setBlogImagePreview("");
  };

  // Members handlers
  const handleMemberImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMemberImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMemberImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateMember = async () => {
    if (!newMember.memberNumber.trim()) {
      alert("El número de socio es requerido");
      return;
    }
    if (!newMember.name.trim()) {
      alert("El nombre es requerido");
      return;
    }
    try {
      await createMember.mutateAsync({
        memberNumber: newMember.memberNumber,
        fullName: newMember.name,
        email: newMember.email,
        phone: newMember.phone,
      });
      setNewMember({ memberNumber: "", name: "", email: "", phone: "", joinDate: new Date().toISOString().split("T")[0] });
      setMemberImageFile(null);
      setMemberImagePreview("");
      membersList.refetch();
      alert("Socio agregado exitosamente");
    } catch (error) {
      alert("Error al agregar socio");
      console.error(error);
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este socio?")) {
      try {
        await deleteMember.mutateAsync({ id });
        membersList.refetch();
        alert("Socio eliminado exitosamente");
      } catch (error) {
        alert("Error al eliminar socio");
        console.error(error);
      }
    }
  };

  const handleEditMember = (member: any) => {
    setEditingMemberId(member.id);
    setNewMember({
      memberNumber: member.memberNumber,
      name: member.fullName,
      email: member.email || "",
      phone: member.phone || "",
      joinDate: member.joinDate || new Date().toISOString().split("T")[0],
    });
  };

  const handleSaveMember = async () => {
    if (!editingMemberId) return;
    try {
      await updateMember.mutateAsync({
        id: editingMemberId,
        memberNumber: newMember.memberNumber,
        fullName: newMember.name,
        email: newMember.email,
        phone: newMember.phone,
      });
      setEditingMemberId(null);
      setNewMember({ memberNumber: "", name: "", email: "", phone: "", joinDate: new Date().toISOString().split("T")[0] });
      membersList.refetch();
      alert("Socio actualizado exitosamente");
    } catch (error) {
      alert("Error al actualizar socio");
    }
  };

  const handleCancelEditMember = () => {
    setEditingMemberId(null);
    setNewMember({ memberNumber: "", name: "", email: "", phone: "", joinDate: new Date().toISOString().split("T")[0] });
  };

  // Documents handlers
  const handleCreateDocument = async () => {
    if (!newDocument.title.trim()) {
      alert("El título es requerido");
      return;
    }
    if (!newDocument.url.trim()) {
      alert("La URL es requerida");
      return;
    }
    try {
      await createDocument.mutateAsync({
        title: newDocument.title,
        description: newDocument.description,
        documentType: newDocument.documentType,
        fileUrl: newDocument.url,
        fileName: newDocument.url.split('/').pop() || 'documento',
      });
      setNewDocument({ title: "", description: "", documentType: "private", url: "" });
      setDocumentFile(null);
      documentsList.refetch();
      alert("Documento agregado exitosamente");
    } catch (error) {
      alert("Error al agregar documento");
      console.error(error);
    }
  };

  const handleDeleteDocument = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este documento?")) {
      try {
        await deleteDocument.mutateAsync({ id });
        documentsList.refetch();
        alert("Documento eliminado exitosamente");
      } catch (error) {
        alert("Error al eliminar documento");
        console.error(error);
      }
    }
  };

  const handleEditDocument = (doc: any) => {
    setEditingDocId(doc.id);
    setNewDocument({
      title: doc.title,
      description: doc.description || "",
      documentType: doc.isPublic ? "public" : "private",
      url: doc.fileUrl,
    });
  };

  const handleSaveDocument = async () => {
    if (!editingDocId) return;
    try {
      await updateDocument.mutateAsync({
        id: editingDocId,
        title: newDocument.title,
        description: newDocument.description,
        documentType: newDocument.documentType,
        fileUrl: newDocument.url,
        fileName: newDocument.url.split("/").pop() || "documento",
        isPublic: newDocument.documentType === "public" ? 1 : 0,
      });
      setEditingDocId(null);
      setNewDocument({ title: "", description: "", documentType: "private", url: "" });
      documentsList.refetch();
      alert("Documento actualizado exitosamente");
    } catch (error) {
      alert("Error al actualizar documento");
    }
  };

  const handleCancelEditDocument = () => {
    setEditingDocId(null);
    setNewDocument({ title: "", description: "", documentType: "private", url: "" });
  };

  if (!authenticated) {
    return (
      <div style={{ padding: 40, maxWidth: 400, margin: "0 auto", marginTop: 100 }}>
        <h2>Acceso Administrador</h2>
        <p>Introduce el código de administrador para acceder al panel.</p>
        <input
          id="admin-code"
          name="admin-code"
          type="password"
          placeholder="Introduce el código"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 10, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4 }}
          onKeyPress={(e) => e.key === "Enter" && handleLogin()}
        />
        <button
          onClick={handleLogin}
          style={{
            marginTop: 20,
            padding: 10,
            width: "100%",
            background: "#003366",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <h1>Panel de Administración</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleBackToHome}
            style={{
              padding: "8px 16px",
              background: "#666",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Volver al sitio
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              background: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, borderBottom: "2px solid #ddd", marginBottom: 30 }}>
        {(["blog", "socios", "documentos", "galeria"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 20px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: activeTab === tab ? "bold" : "normal",
              borderBottom: activeTab === tab ? "3px solid #003366" : "none",
              marginBottom: -2,
            }}
          >
            {tab === "blog" && "📝 Blog"}
            {tab === "socios" && "👥 Socios"}
            {tab === "documentos" && "📄 Documentos"}
            {tab === "galeria" && "🖼️ Galería"}
          </button>
        ))}
      </div>

      {/* Blog Tab */}
      {activeTab === "blog" && (
        <div>
          <h2>Gestión de Blog</h2>

          <div style={{ background: "#f9f9f9", padding: 20, borderRadius: 8, marginBottom: 30 }}>
            <h3>Crear Nuevo Artículo</h3>
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="blog-title">Título:</label>
              <input
                id="blog-title"
                name="blog-title"
                type="text"
                value={newBlogArticle.title}
                onChange={(e) => setNewBlogArticle({ ...newBlogArticle, title: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 5, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="blog-excerpt">Extracto:</label>
              <textarea
                id="blog-excerpt"
                name="blog-excerpt"
                value={newBlogArticle.excerpt}
                onChange={(e) => setNewBlogArticle({ ...newBlogArticle, excerpt: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 5, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4, minHeight: 80 }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="blog-content">Contenido:</label>
              <textarea
                id="blog-content"
                name="blog-content"
                value={newBlogArticle.content}
                onChange={(e) => setNewBlogArticle({ ...newBlogArticle, content: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 5, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4, minHeight: 150 }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="blog-author">Autor (opcional):</label>
              <input
                id="blog-author"
                name="blog-author"
                type="text"
                placeholder="Nombre del autor"
                value={newBlogArticle.author}
                onChange={(e) => setNewBlogArticle({ ...newBlogArticle, author: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 5, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="blog-image">Imagen del Artículo:</label>
              <div style={{ display: "flex", gap: 10, marginTop: 5 }}>
                <input
                  id="blog-image"
                  name="blog-image"
                  type="file"
                  accept="image/*"
                  onChange={handleBlogImageChange}
                  style={{ flex: 1, padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
                />
                <input
                  id="blog-image-url"
                  name="blog-image-url"
                  type="text"
                  placeholder="O ingresa URL"
                  value={newBlogArticle.image}
                  onChange={(e) => setNewBlogArticle({ ...newBlogArticle, image: e.target.value })}
                  style={{ flex: 1, padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
                />
              </div>
              {blogImagePreview && (
                <img src={blogImagePreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: 200, marginTop: 10, borderRadius: 4 }} />
              )}
              <small style={{ color: "#666", marginTop: 5, display: "block" }}>
                Sube un archivo o ingresa una URL de imagen
              </small>
            </div>
            </div>
            <button
              onClick={editingBlogId ? handleSaveBlog : handleCreateBlog}
              style={{
                padding: "10px 20px",
                background: "#003366",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              {editingBlogId ? "Guardar Cambios" : "Crear Artículo"}
            </button>
            {editingBlogId && (
              <button
                onClick={handleCancelEditBlog}
                style={{
                  padding: "10px 20px",
                  background: "#999",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 16,
                  marginLeft: 10,
                }}
              >
                Cancelar
              </button>
            )}
          </div>

          <h3>Artículos Publicados</h3>
          {blogList.isLoading ? (
            <p>Cargando artículos...</p>
          ) : blogList.data && blogList.data.length > 0 ? (
            <div style={{ display: "grid", gap: 15 }}>
              {blogList.data.map((post: any) => (
                <div key={post.id} style={{ background: "#f9f9f9", padding: 15, borderRadius: 8, borderLeft: "4px solid #003366" }}>
                  <h4>{post.title}</h4>
                  <p style={{ color: "#666", marginBottom: 10 }}>{post.excerpt}</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => handleEditBlog(post)}
                      style={{
                        padding: "6px 12px",
                        background: "#0066cc",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(post.id)}
                      style={{
                        padding: "6px 12px",
                        background: "#ff4444",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay artículos publicados.</p>
          )}
        </div>
      )}

      {/* Socios Tab */}
      {activeTab === "socios" && (
        <div>
          <h2>Gestión de Socios</h2>

          <div style={{ background: "#f9f9f9", padding: 20, borderRadius: 8, marginBottom: 30 }}>
            <h3>Agregar Nuevo Socio</h3>
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="member-number">Número de Socio:</label>
              <input
                id="member-number"
                name="member-number"
                type="text"
                value={newMember.memberNumber}
                onChange={(e) => setNewMember({ ...newMember, memberNumber: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 5, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="member-name">Nombre:</label>
              <input
                id="member-name"
                name="member-name"
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 5, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="member-email">Email:</label>
              <input
                id="member-email"
                name="member-email"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 5, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="member-phone">Teléfono:</label>
              <input
                id="member-phone"
                name="member-phone"
                type="text"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 5, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <button
              onClick={editingMemberId ? handleSaveMember : handleCreateMember}
              style={{
                padding: "10px 20px",
                background: "#003366",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              {editingMemberId ? "Guardar Cambios" : "Agregar Socio"}
            </button>
            {editingMemberId && (
              <button
                onClick={handleCancelEditMember}
                style={{
                  padding: "10px 20px",
                  background: "#999",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 16,
                  marginLeft: 10,
                }}
              >
                Cancelar
              </button>
            )}
          </div>

          <h3>Lista de Socios</h3>
          {membersList.isLoading ? (
            <p>Cargando socios...</p>
          ) : membersList.data && membersList.data.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
                <thead>
                  <tr style={{ background: "#f0f0f0", borderBottom: "2px solid #ddd" }}>
                    <th style={{ padding: 12, textAlign: "left" }}>Número</th>
                    <th style={{ padding: 12, textAlign: "left" }}>Nombre Completo</th>
                    <th style={{ padding: 12, textAlign: "left" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {membersList.data.map((member: any) => (
                    <tr key={member.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: 12 }}>{member.memberNumber}</td>
                      <td style={{ padding: 12 }}>{member.fullName}</td>
                      <td style={{ padding: 12, display: "flex", gap: 10 }}>
                        <button
                          onClick={() => handleEditMember(member)}
                          style={{
                            padding: "6px 12px",
                            background: "#0066cc",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          style={{
                            padding: "6px 12px",
                            background: "#ff4444",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No hay socios registrados.</p>
          )}
        </div>
      )}

      {/* Documentos Tab */}
      {activeTab === "documentos" && (
        <div>
          <h2>Gestión de Documentos</h2>

          <div style={{ background: "#f9f9f9", padding: 20, borderRadius: 8, marginBottom: 30 }}>
            <h3>Agregar Nuevo Documento</h3>
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="doc-title">Título:</label>
              <input
                id="doc-title"
                name="doc-title"
                type="text"
                value={newDocument.title}
                onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 5, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="doc-description">Descripción:</label>
              <textarea
                id="doc-description"
                name="doc-description"
                value={newDocument.description}
                onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 5, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4, minHeight: 80 }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="doc-type">Tipo de Documento:</label>
              <select
                id="doc-type"
                name="doc-type"
                value={newDocument.documentType}
                onChange={(e) => setNewDocument({ ...newDocument, documentType: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 5, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4 }}
              >
                <option value="private">Privado</option>
                <option value="public">Público</option>
              </select>
            </div>
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="doc-url">URL del Documento:</label>
              <input
                id="doc-url"
                name="doc-url"
                type="text"
                value={newDocument.url}
                onChange={(e) => setNewDocument({ ...newDocument, url: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 5, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <button
              onClick={editingDocId ? handleSaveDocument : handleCreateDocument}
              style={{
                padding: "10px 20px",
                background: "#003366",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              {editingDocId ? "Guardar Cambios" : "Agregar Documento"}
            </button>
            {editingDocId && (
              <button
                onClick={handleCancelEditDocument}
                style={{
                  padding: "10px 20px",
                  background: "#999",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 16,
                  marginLeft: 10,
                }}
              >
                Cancelar
              </button>
            )}
          </div>

          <h3>Documentos</h3>
          {documentsList.isLoading ? (
            <p>Cargando documentos...</p>
          ) : documentsList.data && documentsList.data.length > 0 ? (
            <div style={{ display: "grid", gap: 15 }}>
              {documentsList.data.map((doc: any) => (
                <div key={doc.id} style={{ background: "#f9f9f9", padding: 15, borderRadius: 8, borderLeft: "4px solid #003366" }}>
                  <h4>{doc.title}</h4>
                  <p style={{ color: "#666", marginBottom: 10 }}>{doc.description}</p>
                  <small style={{ color: "#999" }}>Tipo: {doc.documentType}</small>
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "6px 12px",
                        background: "#003366",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        textDecoration: "none",
                        display: "inline-block",
                      }}
                    >
                      Ver
                    </a>
                    <button
                      onClick={() => handleEditDocument(doc)}
                      style={{
                        padding: "6px 12px",
                        background: "#0066cc",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      style={{
                        padding: "6px 12px",
                        background: "#ff4444",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay documentos registrados.</p>
          )}
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === "galeria" && (
        <div>
          <h2>Gestión de Galería</h2>

          {/* Create Category Section */}
          <div style={{ background: "#f9f9f9", padding: 20, borderRadius: 8, marginBottom: 30 }}>
            <h3>Crear Nueva Sección</h3>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>Nombre de la Sección:</label>
              <input
                type="text"
                placeholder="Ej: Ruta del Rif - Actividad IPA Xerez - Septiembre 2025"
                value={newGalleryCategory.name}
                onChange={(e) => setNewGalleryCategory({ name: e.target.value })}
                style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 4, boxSizing: "border-box" }}
              />
            </div>
            <button
              onClick={async () => {
                if (!newGalleryCategory.name.trim()) {
                  alert("El nombre de la sección es requerido");
                  return;
                }
                try {
                  await createGalleryCategory.mutateAsync({ name: newGalleryCategory.name });
                  setNewGalleryCategory({ name: "" });
                  galleryCategories.refetch();
                  alert("Sección creada exitosamente");
                } catch (error) {
                  alert("Error al crear sección");
                }
              }}
              style={{
                padding: "10px 20px",
                background: "#003366",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Crear Sección
            </button>
          </div>

          {/* Sections List */}
          <div style={{ marginBottom: 30 }}>
            <h3>Secciones Existentes</h3>
            {galleryCategories.isLoading ? (
              <p>Cargando secciones...</p>
            ) : galleryCategories.data && galleryCategories.data.length > 0 ? (
              <div style={{ display: "grid", gap: 15 }}>
                {galleryCategories.data.map((category: any) => {
                  const categoryImages = galleryImages.data?.filter((img: any) => img.categoryId === category.id) || [];
                  return (
                    <div key={category.id} style={{ background: "#f9f9f9", padding: 15, borderRadius: 8, borderLeft: "4px solid #d4af37" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <div>
                          <h4>{category.name}</h4>
                          <small style={{ color: "#666" }}>{categoryImages.length} imágenes</small>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm("¿Estás seguro de que quieres eliminar esta sección y todas sus imágenes?")) {
                              deleteGalleryCategory.mutate({ id: category.id }, {
                                onSuccess: () => {
                                  galleryCategories.refetch();
                                  galleryImages.refetch();
                                  alert("Sección eliminada");
                                },
                              });
                            }
                          }}
                          style={{
                            padding: "6px 12px",
                            background: "#ff4444",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                        >
                          Eliminar
                        </button>
                      </div>

                      {/* Images in this category */}
                      {categoryImages.length > 0 && (
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #ddd" }}>
                          <small style={{ fontWeight: "bold", color: "#333" }}>Imágenes:</small>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 10, marginTop: 10 }}>
                            {categoryImages.map((image: any) => (
                              <div key={image.id} style={{ position: "relative", borderRadius: 4, overflow: "hidden" }}>
                                <img
                                  src={image.image}
                                  alt={image.title}
                                  style={{ width: "100%", height: "100px", objectFit: "cover" }}
                                />
                                <button
                                  onClick={() => {
                                    if (confirm("¿Eliminar esta imagen?")) {
                                      deleteGalleryImage.mutate({ id: image.id }, {
                                        onSuccess: () => {
                                          galleryImages.refetch();
                                          alert("Imagen eliminada");
                                        },
                                      });
                                    }
                                  }}
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    background: "rgba(255, 68, 68, 0.9)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 0,
                                    cursor: "pointer",
                                    padding: "4px 8px",
                                    fontSize: "12px",
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add image to category */}
                      <div style={{ marginTop: 15, paddingTop: 15, borderTop: "1px solid #ddd" }}>
                        <small style={{ fontWeight: "bold", color: "#333" }}>Agregar imagen:</small>
                        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setGalleryImageFile(file);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setGalleryImagePreview(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            style={{ flex: 1, minWidth: "150px" }}
                          />
                          <input
                            type="text"
                            placeholder="Título de la imagen"
                            value={newGalleryImage.title}
                            onChange={(e) => setNewGalleryImage({ ...newGalleryImage, title: e.target.value })}
                            style={{ flex: 1, minWidth: "150px", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
                          />
                          <button
                            onClick={async () => {
                              if (!galleryImageFile) {
                                alert("Selecciona una imagen");
                                return;
                              }
                              if (!newGalleryImage.title.trim()) {
                                alert("Ingresa un título para la imagen");
                                return;
                              }
                              try {
                                const imageUrl = await uploadImageToS3(galleryImageFile);
                                await createGalleryImage.mutateAsync({
                                  categoryId: category.id,
                                  title: newGalleryImage.title,
                                  description: newGalleryImage.description,
                                  image: imageUrl,
                                });
                                setGalleryImageFile(null);
                                setGalleryImagePreview("");
                                setNewGalleryImage({ title: "", description: "", image: "" });
                                galleryImages.refetch();
                                alert("Imagen agregada exitosamente");
                              } catch (error) {
                                alert("Error al agregar imagen");
                              }
                            }}
                            style={{
                              padding: "8px 16px",
                              background: "#0066cc",
                              color: "white",
                              border: "none",
                              borderRadius: 4,
                              cursor: "pointer",
                            }}
                          >
                            Agregar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No hay secciones creadas. Crea una nueva sección arriba.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
