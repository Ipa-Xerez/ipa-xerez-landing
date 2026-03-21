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
  const [newBlogArticle, setNewBlogArticle] = useState({ title: "", excerpt: "", content: "", author: "", image: "" });
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
    fileUrl: "",
    fileName: "",
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [editingDocId, setEditingDocId] = useState<number | null>(null);

  // Gallery state
  const [newGalleryCategory, setNewGalleryCategory] = useState({ name: "" });
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);
  const [newGalleryImage, setNewGalleryImage] = useState({ title: "", description: "", image: "" });
  const [uploadingGalleryImages, setUploadingGalleryImages] = useState(false);
  const [editingImageId, setEditingImageId] = useState<number | null>(null);

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
      let imageUrl = "";
      if (blogImageFile) {
        imageUrl = await uploadImageToS3(blogImageFile);
      }
      await createBlog.mutateAsync({
        title: cleanText(newBlogArticle.title),
        excerpt: cleanText(newBlogArticle.excerpt),
        content: cleanText(newBlogArticle.content),
        author: cleanText(newBlogArticle.author),
        image: imageUrl || "",
        // slug is auto-generated from title on backend
      });
      setNewBlogArticle({ title: "", excerpt: "", content: "", author: "", image: "" });
      setBlogImageFile(null);
      setBlogImagePreview("");
      blogList.refetch();
      alert("Artículo creado exitosamente");
    } catch (error) {
      alert("Error al crear artículo");
      console.error(error);
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
      setNewBlogArticle({ title: "", excerpt: "", content: "", author: "", image: "" });
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
    setNewBlogArticle({ title: "", excerpt: "", content: "", author: "", image: "" });
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
        documentType: newDocument.documentType as "private" | "public",
        fileUrl: newDocument.url,
        fileName: newDocument.url.split('/').pop() || 'document',
      });
      setNewDocument({ title: "", description: "", documentType: "private", url: "", fileUrl: "", fileName: "" });
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

  // Gallery handlers
  const handleCreateGalleryCategory = async () => {
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
      console.error(error);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: 20 }}>
      {!authenticated ? (
        <div style={{
          maxWidth: 400,
          margin: "50px auto",
          background: "white",
          padding: 30,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}>
          <h2>Acceso Administrador</h2>
          <p>Introduce el código de administrador para acceder al panel.</p>
          <input
            type="password"
            placeholder="Introduce el código"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 15,
              border: "1px solid #ccc",
              borderRadius: 4,
              fontSize: 16,
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: 12,
              background: "#003366",
              color: "white",
              border: "none",
              borderRadius: 4,
              fontSize: 16,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Entrar
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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

          {/* Tabs */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20, borderBottom: "2px solid #ddd" }}>
            <button
              onClick={() => setActiveTab("blog")}
              style={{
                padding: "10px 20px",
                background: activeTab === "blog" ? "#003366" : "transparent",
                color: activeTab === "blog" ? "white" : "#333",
                border: "none",
                borderRadius: "4px 4px 0 0",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              📝 Blog
            </button>
            <button
              onClick={() => setActiveTab("socios")}
              style={{
                padding: "10px 20px",
                background: activeTab === "socios" ? "#003366" : "transparent",
                color: activeTab === "socios" ? "white" : "#333",
                border: "none",
                borderRadius: "4px 4px 0 0",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              👥 Socios
            </button>
            <button
              onClick={() => setActiveTab("documentos")}
              style={{
                padding: "10px 20px",
                background: activeTab === "documentos" ? "#003366" : "transparent",
                color: activeTab === "documentos" ? "white" : "#333",
                border: "none",
                borderRadius: "4px 4px 0 0",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              📄 Documentos
            </button>
            <button
              onClick={() => setActiveTab("galeria")}
              style={{
                padding: "10px 20px",
                background: activeTab === "galeria" ? "#003366" : "transparent",
                color: activeTab === "galeria" ? "white" : "#333",
                border: "none",
                borderRadius: "4px 4px 0 0",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              🖼️ Galería
            </button>
          </div>

          {/* Blog Tab */}
          {activeTab === "blog" && (
            <div style={{ background: "white", padding: 20, borderRadius: 8 }}>
              <h2>Gestión de Blog</h2>
              <div style={{ marginBottom: 30 }}>
                <h3>{editingBlogId ? "📝 Editar Artículo" : "🆕 Nuevo Artículo"}</h3>
                <div style={{ display: "grid", gap: 15 }}>
                  <div>
                    <label style={{ fontWeight: "bold" }}>Título:</label>
                    <input
                      type="text"
                      value={newBlogArticle.title}
                      onChange={(e) => setNewBlogArticle({ ...newBlogArticle, title: e.target.value })}
                      style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4, boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: "bold" }}>Extracto:</label>
                    <textarea
                      value={newBlogArticle.excerpt}
                      onChange={(e) => setNewBlogArticle({ ...newBlogArticle, excerpt: e.target.value })}
                      style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4, minHeight: 80, boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: "bold" }}>Contenido:</label>
                    <textarea
                      value={newBlogArticle.content}
                      onChange={(e) => setNewBlogArticle({ ...newBlogArticle, content: e.target.value })}
                      style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4, minHeight: 200, boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: "bold" }}>Autor (opcional):</label>
                    <input
                      type="text"
                      placeholder="Nombre del autor"
                      value={newBlogArticle.author}
                      onChange={(e) => setNewBlogArticle({ ...newBlogArticle, author: e.target.value })}
                      style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4, boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: "bold" }}>Imagen del Artículo:</label>
                    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setBlogImageFile(file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setBlogImagePreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <input
                        type="text"
                        placeholder="O ingresa URL"
                        value={newBlogArticle.image}
                        onChange={(e) => setNewBlogArticle({ ...newBlogArticle, image: e.target.value })}
                        style={{ flex: 1, padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
                      />
                    </div>
                    {blogImagePreview && (
                      <div style={{ marginTop: 10 }}>
                        <img src={blogImagePreview} alt="Preview" style={{ maxWidth: 200, borderRadius: 4 }} />
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={editingBlogId ? handleSaveBlog : handleCreateBlog}
                      style={{
                        padding: "10px 20px",
                        background: "#0066cc",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      {editingBlogId ? "Guardar Cambios" : "Crear Artículo"}
                    </button>
                    {editingBlogId && (
                      <button
                        onClick={handleCancelEditBlog}
                        style={{
                          padding: "10px 20px",
                          background: "#666",
                          color: "white",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                          fontSize: 14,
                          fontWeight: "bold",
                        }}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Blog List */}
              <div>
                <h3>Artículos Publicados</h3>
                {blogList.isLoading ? (
                  <p>Cargando artículos...</p>
                ) : blogList.data && blogList.data.length > 0 ? (
                  <div style={{ display: "grid", gap: 15 }}>
                    {blogList.data.map((blog: any) => (
                      <div key={blog.id} style={{ background: "#f9f9f9", padding: 15, borderRadius: 8, borderLeft: "4px solid #0066cc" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                          <div>
                            <h4>{blog.title}</h4>
                            <p style={{ color: "#666", fontSize: 14 }}>{blog.excerpt}</p>
                            {blog.author && <small style={{ color: "#999" }}>Por: {blog.author}</small>}
                          </div>
                          <div style={{ display: "flex", gap: 10 }}>
                            <button
                              onClick={() => handleEditBlog(blog)}
                              style={{
                                padding: "6px 12px",
                                background: "#0066cc",
                                color: "white",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer",
                                fontSize: 12,
                              }}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog.id)}
                              style={{
                                padding: "6px 12px",
                                background: "#ff4444",
                                color: "white",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer",
                                fontSize: 12,
                              }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No hay artículos publicados.</p>
                )}
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === "socios" && (
            <div style={{ background: "white", padding: 20, borderRadius: 8 }}>
              <h2>Gestión de Socios</h2>
              <div style={{ marginBottom: 30 }}>
                <h3>🆕 Nuevo Socio</h3>
                <div style={{ display: "grid", gap: 15 }}>
                  <input
                    type="text"
                    placeholder="Número de socio"
                    value={newMember.memberNumber}
                    onChange={(e) => setNewMember({ ...newMember, memberNumber: e.target.value })}
                    style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
                  />
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
                  />
                  <button
                    onClick={handleCreateMember}
                    style={{
                      padding: "10px 20px",
                      background: "#0066cc",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    Agregar Socio
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div>
                <h3>Socios Registrados</h3>
                {membersList.isLoading ? (
                  <p>Cargando socios...</p>
                ) : membersList.data && membersList.data.length > 0 ? (
                  <div style={{ display: "grid", gap: 15 }}>
                    {membersList.data.map((member: any) => (
                      <div key={member.id} style={{ background: "#f9f9f9", padding: 15, borderRadius: 8, borderLeft: "4px solid #28a745" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                          <div>
                            <h4>{member.fullName}</h4>
                            <small style={{ color: "#666" }}>Socio #{member.memberNumber}</small>
                            {member.email && <p style={{ fontSize: 12, color: "#999" }}>{member.email}</p>}
                            {member.phone && <p style={{ fontSize: 12, color: "#999" }}>{member.phone}</p>}
                          </div>
                          <div style={{ display: "flex", gap: 10 }}>
                            <button
                              onClick={() => handleEditMember(member)}
                              style={{
                                padding: "6px 12px",
                                background: "#0066cc",
                                color: "white",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer",
                                fontSize: 12,
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
                                fontSize: 12,
                              }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No hay socios registrados.</p>
                )}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documentos" && (
            <div style={{ background: "white", padding: 20, borderRadius: 8 }}>
              <h2>Gestión de Documentos</h2>
              <div style={{ marginBottom: 30 }}>
                <h3>🆕 Nuevo Documento</h3>
                <div style={{ display: "grid", gap: 15 }}>
                  <input
                    type="text"
                    placeholder="Título"
                    value={newDocument.title}
                    onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                    style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
                  />
                  <textarea
                    placeholder="Descripción"
                    value={newDocument.description}
                    onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                    style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4, minHeight: 80 }}
                  />
                  <select
                    value={newDocument.documentType}
                    onChange={(e) => setNewDocument({ ...newDocument, documentType: e.target.value })}
                    style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
                  >
                    <option value="private">Privado</option>
                    <option value="public">Público</option>
                  </select>
                  <input
                    type="text"
                    placeholder="URL del documento"
                    value={newDocument.url}
                    onChange={(e) => setNewDocument({ ...newDocument, url: e.target.value })}
                    style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
                  />
                  <button
                    onClick={handleCreateDocument}
                    style={{
                      padding: "10px 20px",
                      background: "#0066cc",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    Agregar Documento
                  </button>
                </div>
              </div>

              {/* Documents List */}
              <div>
                <h3>Documentos</h3>
                {documentsList.isLoading ? (
                  <p>Cargando documentos...</p>
                ) : documentsList.data && documentsList.data.length > 0 ? (
                  <div style={{ display: "grid", gap: 15 }}>
                    {documentsList.data.map((doc: any) => (
                      <div key={doc.id} style={{ background: "#f9f9f9", padding: 15, borderRadius: 8, borderLeft: "4px solid #ffc107" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                          <div>
                            <h4>{doc.title}</h4>
                            <p style={{ fontSize: 12, color: "#666" }}>{doc.description}</p>
                            <small style={{ color: "#999" }}>Tipo: {doc.documentType === "private" ? "Privado" : "Público"}</small>
                          </div>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            style={{
                              padding: "6px 12px",
                              background: "#ff4444",
                              color: "white",
                              border: "none",
                              borderRadius: 4,
                              cursor: "pointer",
                              fontSize: 12,
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No hay documentos.</p>
                )}
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === "galeria" && (
            <div style={{ background: "white", padding: 20, borderRadius: 8 }}>
              <h2>Gestión de Galería</h2>

              {/* Create new category */}
              <div style={{ marginBottom: 30 }}>
                <h3>Crear Nueva Sección</h3>
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    type="text"
                    placeholder="Ej: Ruta del Rif - Actividad IPA Xerez - Septiembre 2025"
                    value={newGalleryCategory.name}
                    onChange={(e) => setNewGalleryCategory({ name: e.target.value })}
                    style={{ flex: 1, padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
                  />
                  <button
                    onClick={handleCreateGalleryCategory}
                    style={{
                      padding: "8px 16px",
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
              </div>

              {/* Sections List */}
              <div style={{ marginBottom: 30 }}>
                <h3>Secciones Existentes</h3>
                {galleryCategories.isLoading ? (
                  <p>Cargando secciones...</p>
                ) : galleryCategories.data && galleryCategories.data.length > 0 ? (
                  <div style={{ display: "grid", gap: 15 }}>
                    {galleryCategories.data.map((category: any) => {
                      const categoryId = category.id;
                      const categoryImages = galleryImages.data?.filter((img: any) => img.categoryId === categoryId) || [];
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

                          {/* Add multiple images to category */}
                          <div style={{ marginTop: 15, paddingTop: 15, borderTop: "1px solid #ddd" }}>
                            <small style={{ fontWeight: "bold", color: "#333" }}>Agregar imágenes:</small>
                            <div style={{ marginTop: 10 }}>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || []);
                                  if (files.length > 0) {
                                    setGalleryImageFiles(files);
                                    // Generate previews
                                    const previews: string[] = [];
                                    let loadedCount = 0;
                                    files.forEach((file) => {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        previews.push(reader.result as string);
                                        loadedCount++;
                                        if (loadedCount === files.length) {
                                          setGalleryImagePreviews(previews);
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    });
                                  }
                                }}
                                style={{ marginBottom: 10, width: "100%" }}
                              />
                              
                              {/* Preview selected images */}
                              {galleryImagePreviews.length > 0 && (
                                <div style={{ marginBottom: 15 }}>
                                  <small style={{ fontWeight: "bold", color: "#333" }}>Imágenes seleccionadas ({galleryImagePreviews.length}):</small>
                                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 10, marginTop: 10 }}>
                                    {galleryImagePreviews.map((preview, idx) => (
                                      <div key={idx} style={{ position: "relative", borderRadius: 4, overflow: "hidden", border: "2px solid #ddd" }}>
                                        <img
                                          src={preview}
                                          alt={`Preview ${idx}`}
                                          style={{ width: "100%", height: "80px", objectFit: "cover" }}
                                        />
                                        <button
                                          onClick={() => {
                                            const newFiles = galleryImageFiles.filter((_, i) => i !== idx);
                                            const newPreviews = galleryImagePreviews.filter((_, i) => i !== idx);
                                            setGalleryImageFiles(newFiles);
                                            setGalleryImagePreviews(newPreviews);
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
                                            padding: "2px 6px",
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
                              
                              <button
                                onClick={async () => {
                                  if (galleryImageFiles.length === 0) {
                                    alert("Selecciona al menos una imagen");
                                    return;
                                  }
                                  setUploadingGalleryImages(true);
                                  try {
                                    let successCount = 0;
                                    let errorCount = 0;
                                    for (let i = 0; i < galleryImageFiles.length; i++) {
                                      const file = galleryImageFiles[i];
                                      try {
                                        const imageUrl = await uploadImageToS3(file);
                                        // Generate automatic title from filename
                                        const fileName = file.name.replace(/\.[^/.]+$/, "");
                                        await createGalleryImage.mutateAsync({
                                          categoryId: category.id,
                                          title: fileName,
                                          description: "",
                                          image: imageUrl,
                                        });
                                        successCount++;
                                      } catch (itemError) {
                                        console.error(`Error al subir ${file.name}:`, itemError);
                                        errorCount++;
                                      }
                                    }
                                    setGalleryImageFiles([]);
                                    setGalleryImagePreviews([]);
                                    galleryImages.refetch();
                                    if (errorCount > 0) {
                                      alert(`${successCount} imagen(es) agregada(s), ${errorCount} error(es)`);
                                    } else {
                                      alert(`${successCount} imagen(es) agregada(s) exitosamente`);
                                    }
                                  } catch (error) {
                                    alert("Error al agregar imágenes");
                                    console.error(error);
                                  } finally {
                                    setUploadingGalleryImages(false);
                                  }
                                }}
                                disabled={uploadingGalleryImages || galleryImageFiles.length === 0}
                                style={{
                                  padding: "10px 20px",
                                  background: uploadingGalleryImages || galleryImageFiles.length === 0 ? "#ccc" : "#0066cc",
                                  color: "white",
                                  border: "none",
                                  borderRadius: 4,
                                  cursor: uploadingGalleryImages || galleryImageFiles.length === 0 ? "not-allowed" : "pointer",
                                  fontSize: 14,
                                  fontWeight: "bold",
                                }}
                              >
                                {uploadingGalleryImages ? `Subiendo... (${galleryImageFiles.length})` : `Agregar ${galleryImageFiles.length > 0 ? galleryImageFiles.length : ""} imagen(es)`}
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
      )}
    </div>
  );
}
