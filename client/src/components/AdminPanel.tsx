import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

const ADMIN_EMAIL = "Ipaagrupacionxerez@gmail.com";

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"blog" | "members" | "documents">("blog");

  // Verificar si es admin
  if (!user || user.email !== ADMIN_EMAIL) {
    return null;
  }

  // Obtener datos
  const { data: posts } = trpc.blog.getAll.useQuery();
  const { data: members } = trpc.members.getAll.useQuery();
  const { data: documents } = trpc.documents.getAll.useQuery();

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#003366]">Panel Admin</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await logout();
              window.location.href = "/";
            }}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b">
          <button
            onClick={() => setActiveTab("blog")}
            className={`px-3 py-2 text-sm font-semibold ${
              activeTab === "blog"
                ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                : "text-gray-600"
            }`}
          >
            Blog ({posts?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-3 py-2 text-sm font-semibold ${
              activeTab === "members"
                ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                : "text-gray-600"
            }`}
          >
            Socios ({members?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-3 py-2 text-sm font-semibold ${
              activeTab === "documents"
                ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                : "text-gray-600"
            }`}
          >
            Docs ({documents?.length || 0})
          </button>
        </div>

        {/* Content */}
        <div className="text-sm text-gray-700 mb-4 max-h-48 overflow-y-auto">
          {activeTab === "blog" && (
            <div>
              <p className="font-semibold mb-2">Últimos artículos:</p>
              {posts?.slice(0, 3).map((post: any) => (
                <p key={post.id} className="text-xs text-gray-600 mb-1">
                  • {post.title}
                </p>
              ))}
            </div>
          )}
          {activeTab === "members" && (
            <div>
              <p className="font-semibold mb-2">Total de socios: {members?.length}</p>
              <p className="text-xs text-gray-600">
                Gestiona los miembros de IPA Xerez
              </p>
            </div>
          )}
          {activeTab === "documents" && (
            <div>
              <p className="font-semibold mb-2">Total de documentos: {documents?.length}</p>
              <p className="text-xs text-gray-600">
                Documentos privados disponibles
              </p>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 text-center">
          Admin: {user.email}
        </p>
      </div>
    </div>
  );
}
