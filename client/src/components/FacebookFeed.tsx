import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function FacebookFeed() {
  const { data: feedData, isLoading, error } = trpc.facebook.getFeed.useQuery();

  useEffect(() => {
    // Load Facebook SDK for embedded posts
    if ((window as any).FB) {
      (window as any).FB.XFBML.parse();
    }
  }, [feedData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !feedData?.success || !feedData.posts || feedData.posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p>No hay posts disponibles en este momento</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedData.posts.map((post: any) => (
        <div key={post.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          {/* Post Image */}
          {post.picture && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img
                src={post.picture}
                alt="Post"
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Post Content */}
          <div className="space-y-3">
            {post.message && (
              <p className="text-gray-800 text-sm leading-relaxed">
                {post.message.split('\n').map((line: string, idx: number) => (
                  <span key={idx}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            )}

            {post.story && !post.message && (
              <p className="text-gray-600 text-sm italic">
                {post.story}
              </p>
            )}

            {/* Post Date */}
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
              {new Date(post.created_time).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            {/* Facebook Link */}
            {post.link && (
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ver en Facebook →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
