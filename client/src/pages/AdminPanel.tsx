import { useState } from "react";
import { trpc } from "../lib/trpc";
import { useLocation } from "wouter";

type TabType = "blog" | "socios" | "documentos";

export default function AdminPanel() {
  const [code, setCode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("blog");
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
      setBlogImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogImagePreview(reader.result as string);
        setNewBlogArticle({ ...newBlogArticle, image: reader.result as string });
      };
      reader.readAsDataURL(file);
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
      console.log("[Blog] Enviando datos:", {
        title: newBlogArticle.title.substring(0, 50),
        excerptLen: newBlogArticle.excerpt.length,
        contentLen: newBlogArticle.content.length,
        author: newBlogArticle.author,
        hasImage: !!newBlogArticle.image,
      });
      await createBlog.mutateAsync({
        title: cleanText(newBlogArticle.title),
        excerpt: cleanText(newBlogArticle.excerpt),
        content: cleanText(newBlogArticle.content),
        author: cleanText(newBlogArticle.author),
        image: newBlogArticle.image,
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
    if (!newMember.memberNumber.trim() || !newMember.name.trim()) {
      alert("Número de socio y nombre son requeridos");
      return;
    }
    try {
      await createMember.mutateAsync({
        memberNumber: newMember.memberNumber,
        fullName: newMember.name,
        email: newMember.email || "",
        phone: newMember.phone,
      });
      setNewMember({ memberNumber: "", name: "", email: "", phone: "", joinDate: new Date().toISOString().split("T")[0] });
      setMemberImageFile(null);
      setMemberImagePreview("");
      membersList.refetch();
      alert("Socio agregado exitosamente");
    } catch (error) {
      alert("Error al agregar socio: " + (error instanceof Error ? error.message : "Error desconocido"));
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

  // Documents handlers
  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDocument({ ...newDocument, url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateDocument = async () => {
    if (!newDocument.title.trim() || !newDocument.url.trim()) {
      alert("Título y URL son requeridos");
      return;
    }
    try {
      await createDocument.mutateAsync({
        title: newDocument.title,
        description: newDocument.description,
        documentType: newDocument.documentType,
        fileUrl: newDocument.url,
        fileName: newDocument.url.split('/').pop() || 'document',
      });
      setNewDocument({ title: "", description: "", documentType: "private", url: "" });
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

  if (!authenticated) {
    return (
      <div style={{ padding: 40, maxWidth: 400, margin: "0 auto", marginTop: 60 }}>
        <h2 style={{ textAlign: "center", marginBottom: 30 }}>Panel de Administración</h2>
        <p style={{ color: "#666", marginBottom: 20, textAlign: "center" }}>
          Ingresa el código para acceder al panel de administración
        </p>
        <input
          type="password"
          placeholder="Código de acceso"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleLogin()}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 10,
            boxSizing: "border-box",
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        />
        <button
          onClick={handleLogin}
          style={{
            marginTop: 20,
            padding: 12,
            width: "100%",
            background: "#003366",
            color: "white",
            cursor: "pointer",
            border: "none",
            borderRadius: 4,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Acceder
        </button>
        <button
          onClick={handleBackToHome}
          style={{
            marginTop: 10,
            padding: 12,
            width: "100%",
            background: "#f0f0f0",
            color: "#333",
            cursor: "pointer",
            border: "1px solid #ccc",
            borderRadius: 4,
            fontSize: 16,
          }}
        >
          Volver al Sitio
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <h1>Panel de Administración</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleBackToHome}
            style={{
              padding: "8px 16px",
              background: "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Volver al Sitio
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
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 30, borderBottom: "2px solid #ddd" }}>
        {(["blog", "socios", "documentos"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "12px 24px",
              background: activeTab === tab ? "#003366" : "transparent",
              color: activeTab === tab ? "white" : "#333",
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
            </div>
            <button
              onClick={handleCreateBlog}
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
              Crear Artículo
            </button>
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
              <label>Número de Socio:</label>
              <input
                type="text"
                value={newMember.memberNumber}
                onChange={(e) => setNewMember({ ...newMember, memberNumber: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 5, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label>Nombre:</label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 5, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label>Email:</label>
              <input
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 5, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label>Teléfono:</label>
              <input
                type="text"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 5, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <button
              onClick={handleCreateMember}
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
              Agregar Socio
            </button>
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
                      <td style={{ padding: 12 }}>
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
              <label>Título:</label>
              <input
                type="text"
                value={newDocument.title}
                onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 5, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label>Descripción:</label>
              <textarea
                value={newDocument.description}
                onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                style={{ width: "100%", padding: 8, marginTop: 5, boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 4, minHeight: 80 }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label>Archivo del Documento:</label>
              <div style={{ display: "flex", gap: 10, marginTop: 5 }}>
                <input
                  type="file"
                  onChange={handleDocumentFileChange}
                  style={{ flex: 1, padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
                />
                <input
                  type="text"
                  placeholder="O ingresa URL"
                  value={newDocument.url}
                  onChange={(e) => setNewDocument({ ...newDocument, url: e.target.value })}
                  style={{ flex: 1, padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
                />
              </div>
              {documentFile && (
                <p style={{ marginTop: 10, color: "#666" }}>Archivo seleccionado: {documentFile.name}</p>
              )}
            </div>
            <button
              onClick={handleCreateDocument}
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
              Agregar Documento
            </button>
          </div>

          <h3>Documentos Privados</h3>
          {documentsList.isLoading ? (
            <p>Cargando documentos...</p>
          ) : documentsList.data && documentsList.data.length > 0 ? (
            <div style={{ display: "grid", gap: 15 }}>
              {documentsList.data.map((doc: any) => (
                <div key={doc.id} style={{ background: "#f9f9f9", padding: 15, borderRadius: 8, borderLeft: "4px solid #003366" }}>
                  <h4>{doc.title}</h4>
                  <p style={{ color: "#666", marginBottom: 10 }}>{doc.description}</p>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: "#003366", textDecoration: "underline", marginRight: 15 }}>
                    Ver Documento
                  </a>
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
              ))}
            </div>
          ) : (
            <p>No hay documentos privados.</p>
          )}
        </div>
      )}
    </div>
  );
}
