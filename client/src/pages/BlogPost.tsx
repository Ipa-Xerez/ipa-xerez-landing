import { useParams } from "react-router-dom";
import { trpc } from "../utils/trpc";

export default function BlogPost() {
  const { id } = useParams();
  const { data: post, isLoading } = trpc.blog.getOne.useQuery({ id: id! });

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
