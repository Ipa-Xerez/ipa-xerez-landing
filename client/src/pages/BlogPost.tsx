import { useRoute } from "wouter";
import { trpc } from "../lib/trpc";

export default function BlogPost() {
  const [match, params] = useRoute("/blog/:id");
  const { data: post, isLoading } = trpc.blog.getById.useQuery({ id: parseInt(params?.id || "0") });

  if (isLoading) {
    return <div style={{ padding: 40 }}>Cargando artículo...</div>;
  }

  if (!post) {
    return <div style={{ padding: 40 }}>Artículo no encontrado.</div>;
  }

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <h1>{post.title}</h1>
      <p style={{ color: "#666" }}>{post.excerpt}</p>

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          style={{ width: "100%", marginTop: 20, borderRadius: 8 }}
        />
      )}

      <div style={{ marginTop: 20, whiteSpace: "pre-line" }}>
        {post.content}
      </div>
    </div>
  );
}
