import { trpc } from "../lib/trpc";
import { Link, useLocation } from "wouter";

export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.list.useQuery();

  if (isLoading) {
    return <div style={{ padding: 40 }}>Cargando artículos...</div>;
  }

  if (!posts || posts.length === 0) {
    return <div style={{ padding: 40 }}>No hay artículos publicados todavía.</div>;
  }

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <h1>Blog</h1>

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            padding: 20,
            borderBottom: "1px solid #ddd",
            marginBottom: 20,
          }}
        >
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>

          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              style={{ width: "100%", marginTop: 10, borderRadius: 8 }}
            />
          )}

          <Link
            href={`/blog/${post.id}`}
            style={{
              display: "inline-block",
              marginTop: 10,
              color: "blue",
              textDecoration: "underline",
            }}
          >
            Leer más
          </Link>
        </div>
      ))}
    </div>
  );
}

