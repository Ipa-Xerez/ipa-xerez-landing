import { useState } from "react";
import { trpc } from "../lib/trpc";

export default function AdminBlog() {
  const [code, setCode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const blogList = trpc.blog.list.useQuery();
  const createArticle = trpc.blog.create.useMutation();
  const deleteArticle = trpc.blog.delete.useMutation();

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

      <input
        type="text"
        placeholder="URL de imagen (opcional)"
        value={newArticle.image}
        onChange={(e) =>
          setNewArticle({ ...newArticle, image: e.target.value })
        }
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <button
        onClick={handleCreate}
        style={{
          marginTop: 20,
          padding: 10,
          width: "100%",
          background: "green",
          color: "white",
        }}
      >
        Publicar artículo
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
