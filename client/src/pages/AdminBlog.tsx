import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "../lib/trpc";

export default function AdminBlog() {
  const [code, setCode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const blogList = trpc.blog.list.useQuery();
  const createArticle = trpc.blog.create.useMutation();
  const updateArticle = trpc.blog.update.useMutation();
  const deleteArticle = trpc.blog.delete.useMutation();

  const emptyArticle = {
    title: "",
    excerpt: "",
    content: "",
    image: "",
    featured: 0,
    featuredOrder: 0,
  };

  const [newArticle, setNewArticle] = useState(emptyArticle);

  const handleLogin = () => {
    if (code === "31907") {
      setAuthenticated(true);
    } else {
      alert("Código incorrecto");
    }
  };

  const handleCreate = async () => {
    await createArticle.mutateAsync(newArticle);
    blogList.refetch();
    setNewArticle(emptyArticle);
    setImagePreview(null);
  };

  const handleUpdate = async () => {
    if (editingId === null) return;
    await updateArticle.mutateAsync({ id: editingId, ...newArticle });
    blogList.refetch();
    setNewArticle(emptyArticle);
    setImagePreview(null);
    setEditingId(null);
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setNewArticle({
      title: post.title || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      image: post.image || "",
      featured: post.featured ?? 0,
      featuredOrder: post.featuredOrder ?? 0,
    });
    setImagePreview(post.image || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewArticle(emptyArticle);
    setImagePreview(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar este artículo?")) return;
    await deleteArticle.mutateAsync({ id });
    blogList.refetch();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Mostrar preview inmediatamente
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      // Subir via endpoint HTTP multipart (sin límite de tamaño)
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(err.error || "Error del servidor");
      }
      const result = await response.json();
      setNewArticle((prev) => ({ ...prev, image: result.url }));
      alert("Imagen subida exitosamente");
    } catch (error: any) {
      console.error("Error al subir imagen:", error);
      alert("Error al subir imagen: " + (error?.message || error));
    } finally {
      setUploading(false);
    }
  };

  if (!authenticated) {
    return (
      <div style={{ padding: 40, maxWidth: 400, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <a href="/" style={{ color: "#003366", textDecoration: "none", fontSize: 14 }}>← Volver al inicio</a>
        </div>
        <h2>Acceso Administrador</h2>
        <input
          type="password"
          placeholder="Introduce el código"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{ width: "100%", padding: 10, marginTop: 10 }}
        />
        <button
          onClick={handleLogin}
          style={{ marginTop: 20, padding: 10, width: "100%", background: "black", color: "white" }}
        >
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
      {/* Barra de navegación */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        padding: "12px 20px",
        background: "#003366",
        borderRadius: 8,
        color: "white",
      }}>
        <a href="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: 15 }}>← Volver al inicio</a>
        <span style={{ fontWeight: "bold", fontSize: 16 }}>📝 Panel del Blog</span>
        <button
          onClick={() => { setAuthenticated(false); setCode(""); }}
          style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.4)", padding: "6px 14px", borderRadius: 4, cursor: "pointer", fontSize: 14 }}
        >
          Cerrar sesión
        </button>
      </div>
      <h1>Panel del Blog</h1>

      <h2 style={{ marginTop: 20, color: editingId ? "#b45309" : "#003366" }}>
        {editingId ? `✏️ Editando artículo #${editingId}` : "Crear nuevo artículo"}
      </h2>

      <input
        type="text"
        placeholder="Título"
        value={newArticle.title}
        onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <input
        type="text"
        placeholder="Extracto (resumen breve)"
        value={newArticle.excerpt}
        onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <textarea
        placeholder="Contenido del artículo"
        value={newArticle.content}
        onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
        style={{ width: "100%", padding: 10, marginTop: 10, height: 200 }}
      />

      {/* Imagen */}
      <div style={{ marginTop: 10 }}>
        <label style={{ display: "block", marginBottom: 10, fontWeight: "bold" }}>
          Imagen del artículo:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        {imagePreview && (
          <div style={{ marginBottom: 10 }}>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: 4 }} />
          </div>
        )}
        {newArticle.image && (
          <div style={{ marginBottom: 10, padding: 10, background: "#e8f5e9", borderRadius: 4 }}>
            <p style={{ margin: 0, color: "#2e7d32", fontSize: 14 }}>✓ Imagen cargada correctamente</p>
          </div>
        )}
        <input
          type="text"
          placeholder="O pega una URL de imagen (opcional)"
          value={newArticle.image}
          onChange={(e) => setNewArticle({ ...newArticle, image: e.target.value })}
          style={{ width: "100%", padding: 10 }}
        />
      </div>

      {/* Campos Mostrar en portada */}
      <div style={{ marginTop: 16, padding: 16, background: "#f0f4ff", borderRadius: 8, border: "1px solid #c7d2fe" }}>
        <h3 style={{ margin: "0 0 12px 0", color: "#003366", fontSize: 16 }}>📌 Portada (Sección ACTUALIDAD)</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <label style={{ fontWeight: "bold", minWidth: 160 }}>Mostrar en portada:</label>
          <select
            value={newArticle.featured}
            onChange={(e) => setNewArticle({ ...newArticle, featured: Number(e.target.value) })}
            style={{ padding: "8px 12px", borderRadius: 4, border: "1px solid #ccc", fontSize: 14 }}
          >
            <option value={0}>No</option>
            <option value={1}>Sí</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ fontWeight: "bold", minWidth: 160 }}>Orden en portada:</label>
          <input
            type="number"
            min={0}
            max={99}
            value={newArticle.featuredOrder}
            onChange={(e) => setNewArticle({ ...newArticle, featuredOrder: Number(e.target.value) })}
            style={{ padding: "8px 12px", borderRadius: 4, border: "1px solid #ccc", width: 80, fontSize: 14 }}
          />
          <span style={{ fontSize: 13, color: "#666" }}>(0 = primero, 1 = segundo, etc.)</span>
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        {editingId ? (
          <>
            <button
              onClick={handleUpdate}
              disabled={uploading || !newArticle.title || !newArticle.excerpt || !newArticle.content}
              style={{
                flex: 1, padding: 12, background: "#b45309", color: "white", border: "none",
                borderRadius: 4, cursor: "pointer", fontSize: 15, fontWeight: "bold",
              }}
            >
              💾 Guardar cambios
            </button>
            <button
              onClick={handleCancelEdit}
              style={{
                padding: 12, background: "#6b7280", color: "white", border: "none",
                borderRadius: 4, cursor: "pointer", fontSize: 15,
              }}
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            onClick={handleCreate}
            disabled={uploading || !newArticle.title || !newArticle.excerpt || !newArticle.content}
            style={{
              flex: 1, padding: 12,
              background: uploading || !newArticle.title || !newArticle.excerpt || !newArticle.content ? "#ccc" : "#003366",
              color: "white", border: "none", borderRadius: 4,
              cursor: uploading || !newArticle.title || !newArticle.excerpt || !newArticle.content ? "not-allowed" : "pointer",
              fontSize: 15, fontWeight: "bold",
            }}
          >
            {uploading ? "Subiendo imagen..." : "✅ Publicar artículo"}
          </button>
        )}
      </div>

      <h2 style={{ marginTop: 40 }}>Artículos publicados</h2>

      {blogList.isLoading && <p>Cargando...</p>}

      {blogList.data?.map((post) => (
        <div
          key={post.id}
          style={{
            padding: 15, border: editingId === post.id ? "2px solid #b45309" : "1px solid #ccc",
            marginBottom: 10, borderRadius: 6, background: editingId === post.id ? "#fff7ed" : "white",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: "0 0 4px 0" }}>{post.title}</h3>
              <p style={{ margin: "0 0 4px 0", color: "#666", fontSize: 13 }}>{post.excerpt}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {post.featured === 1 && (
                  <span style={{ background: "#D4AF37", color: "#003366", padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: "bold" }}>
                    📌 En portada (orden: {post.featuredOrder})
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginLeft: 10 }}>
              <button
                onClick={() => handleEdit(post)}
                style={{ background: "#003366", color: "white", padding: "6px 12px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 13 }}
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                style={{ background: "red", color: "white", padding: "6px 12px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 13 }}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
