import { trpc } from "@/lib/trpc";
import { Heart, MessageCircle, Share2, Smile } from "lucide-react";
import { useEffect, useState } from "react";

interface FacebookEngagementStatsProps {
  facebookPostId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export default function FacebookEngagementStats({
  facebookPostId,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
}: FacebookEngagementStatsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: metrics, refetch } = trpc.facebook.getEngagementMetrics.useQuery(
    { facebookPostId: facebookPostId || "" },
    { enabled: !!facebookPostId }
  );

  // Auto-refresh metrics
  useEffect(() => {
    if (!autoRefresh || !facebookPostId) return;

    const interval = setInterval(() => {
      setIsRefreshing(true);
      refetch().finally(() => setIsRefreshing(false));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, facebookPostId, refreshInterval, refetch]);

  if (!facebookPostId) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No Facebook post ID provided</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No engagement data available</p>
      </div>
    );
  }

  const reactions = metrics.reactions || {};

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Likes */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-5 h-5 text-red-600" />
            <span className="text-xs font-semibold text-red-600 bg-red-200 px-2 py-1 rounded">
              Me gusta
            </span>
          </div>
          <p className="text-2xl font-bold text-red-700">{metrics.likes || 0}</p>
        </div>

        {/* Comments */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 bg-blue-200 px-2 py-1 rounded">
              Comentarios
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{metrics.comments || 0}</p>
        </div>

        {/* Shares */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Share2 className="w-5 h-5 text-green-600" />
            <span className="text-xs font-semibold text-green-600 bg-green-200 px-2 py-1 rounded">
              Compartidos
            </span>
          </div>
          <p className="text-2xl font-bold text-green-700">{metrics.shares || 0}</p>
        </div>

        {/* Total Engagement */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Smile className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-semibold text-purple-600 bg-purple-200 px-2 py-1 rounded">
              Total
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {(metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0)}
          </p>
        </div>
      </div>

      {/* Reactions Breakdown */}
      {Object.keys(reactions).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Reacciones</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {Object.entries(reactions).map(([type, count]) => (
              <div key={type} className="text-center">
                <div className="text-2xl mb-1">
                  {getReactionEmoji(type)}
                </div>
                <p className="text-xs font-semibold text-gray-700">{count as number}</p>
                <p className="text-xs text-gray-500 capitalize">{type.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Última actualización: {metrics.lastUpdated ? new Date(metrics.lastUpdated).toLocaleTimeString() : "N/A"}</span>
        <button
          onClick={() => {
            setIsRefreshing(true);
            refetch().finally(() => setIsRefreshing(false));
          }}
          disabled={isRefreshing}
          className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          {isRefreshing ? "Actualizando..." : "Actualizar"}
        </button>
      </div>
    </div>
  );
}

function getReactionEmoji(type: string): string {
  const emojiMap: Record<string, string> = {
    LIKE: "👍",
    LOVE: "❤️",
    HAHA: "😂",
    WOW: "😮",
    SAD: "😢",
    ANGRY: "😠",
  };
  return emojiMap[type] || "👍";
}
