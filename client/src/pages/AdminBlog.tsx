import { useState } from "react";
import { trpc } from "../lib/trpc";

export default function AdminBlog() {
  const [code, setCode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const blogList = trpc.blog.list.useQuery();
  const createArticle = trpc.blog.create.useMutation();
  const deleteArticle = trpc.blog.delete.useMutation();
  const uploadBlogImage = trpc.blog.uploadImage.useMutation();

  const [newArticle, setNewArticle] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
  });

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
    setNewArticle({ title: "", excerpt: "", content: "", image: "" });
  };

  const handleDelete = async (id: number) => {
    await deleteArticle.mutateAsync({ id });
    blogList.refetch();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to S3
      const result = await uploadBlogImage.mutateAsync({ file });
      setNewArticle({ ...newArticle, image: result.url });
      alert("Imagen subida exitosamente");
    } catch (error) {
      console.error("Error al subir imagen:", error);
      alert("Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  if (!authenticated) {
    return (
      <div style={{ padding: 40, maxWidth: 400, margin: "0 auto" }}>
        <h2>Acceso Administrador</h2>
        <input
          type="password"
          placeholder="Introduce el código"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 10 }}
        />
        <button
          onClick={handleLogin}
          style={{
            marginTop: 20,
            padding: 10,
            width: "100%",
            background: "black",
            color: "white",
          }}
        >
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Panel del Blog</h1>

      <h2>Crear nuevo artículo</h2>

      <input
        type="text"
        placeholder="Título"
        value={newArticle.title}
        onChange={(e) =>
          setNewArticle({ ...newArticle, title: e.target.value })
        }
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <input
        type="text"
        placeholder="Extracto"
        value={newArticle.excerpt}
        onChange={(e) =>
          setNewArticle({ ...newArticle, excerpt: e.target.value })
        }
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <textarea
        placeholder="Contenido del artículo"
        value={newArticle.content}
        onChange={(e) =>
          setNewArticle({ ...newArticle, content: e.target.value })
        }
        style={{ width: "100%", padding: 10, marginTop: 10, height: 200 }}
      />

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
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: 4 }}
            />
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
          onChange={(e) =>
            setNewArticle({ ...newArticle, image: e.target.value })
          }
          style={{ width: "100%", padding: 10 }}
        />
      </div>

      <button
        onClick={handleCreate}
        disabled={uploading || !newArticle.title || !newArticle.excerpt || !newArticle.content}
        style={{
          marginTop: 20,
          padding: 10,
          width: "100%",
          background: uploading || !newArticle.title || !newArticle.excerpt || !newArticle.content ? "#ccc" : "green",
          color: "white",
          cursor: uploading || !newArticle.title || !newArticle.excerpt || !newArticle.content ? "not-allowed" : "pointer",
        }}
      >
        {uploading ? "Subiendo imagen..." : "Publicar artículo"}
      </button>

      <h2 style={{ marginTop: 40 }}>Artículos publicados</h2>

      {blogList.data?.map((post) => (
        <div
          key={post.id}
          style={{
            padding: 15,
            border: "1px solid #ccc",
            marginBottom: 10,
          }}
        >
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>

          <button
            onClick={() => handleDelete(post.id)}
            style={{
              background: "red",
              color: "white",
              padding: 8,
              marginTop: 10,
            }}
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
