import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Mail, Users, Send, Download, Trash2, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";



export default function NewsletterAdmin() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"subscribers" | "create">("subscribers");
  const [campaignSubject, setCampaignSubject] = useState("");
  const [campaignContent, setCampaignContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [sendingCampaignId, setSendingCampaignId] = useState<number | null>(null);

  // Queries
  const subscribersQuery = trpc.newsletter.getSubscribers.useQuery(undefined, {
    enabled: activeTab === "subscribers",
  });
  const campaignsQuery = trpc.newsletter.getCampaigns.useQuery();

  // Mutations
  const createCampaignMutation = trpc.newsletter.createCampaign.useMutation({
    onSuccess: () => {
      setCampaignSubject("");
      setCampaignContent("");
      campaignsQuery.refetch();
    },
  });

  const sendCampaignMutation = trpc.newsletter.sendCampaign.useMutation({
    onSuccess: () => {
      setSendingCampaignId(null);
      campaignsQuery.refetch();
    },
  });

  // Redirect if not authenticated
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  if (!user) {
    navigate("/");
    return null;
  }

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignSubject.trim() || !campaignContent.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    await createCampaignMutation.mutateAsync({
      subject: campaignSubject,
      content: campaignContent,
    });
  };

  const handleSendCampaign = async (campaignId: number) => {
    if (confirm("¿Estás seguro de que deseas enviar este newsletter a todos los suscriptores?")) {
      setSendingCampaignId(campaignId);
      await sendCampaignMutation.mutateAsync({ campaignId });
    }
  };

  const handleDownloadSubscribers = () => {
    if (!subscribersQuery.data) return;

    const csv = [
      ["Email", "Nombre", "Fecha de Suscripción"],
      ...subscribersQuery.data.map((s) => [
        s.email,
        s.name || "",
        new Date(s.subscribedAt).toLocaleDateString("es-ES"),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suscriptores-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BackButton />
      <Breadcrumbs items={[{ label: "Panel de Newsletter" }]} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-[#003366] mb-2 font-bold">Panel de Newsletter</h1>
          <p className="text-gray-600">Gestiona suscriptores y crea campañas de newsletter</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("subscribers")}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === "subscribers"
                ? "text-[#003366] border-b-2 border-[#003366]"
                : "text-gray-600 hover:text-[#003366]"
            }`}
          >
            <Users className="inline mr-2 w-5 h-5" />
            Suscriptores ({subscribersQuery.data?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === "create"
                ? "text-[#003366] border-b-2 border-[#003366]"
                : "text-gray-600 hover:text-[#003366]"
            }`}
          >
            <Mail className="inline mr-2 w-5 h-5" />
            Crear Newsletter
          </button>
        </div>

        {/* Subscribers Tab */}
        {activeTab === "subscribers" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#003366]">Suscriptores</h2>
              <Button
                onClick={handleDownloadSubscribers}
                disabled={!subscribersQuery.data || subscribersQuery.data.length === 0}
                className="bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700]"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar CSV
              </Button>
            </div>

            {subscribersQuery.isLoading ? (
              <div className="text-center py-8">Cargando suscriptores...</div>
            ) : subscribersQuery.data && subscribersQuery.data.length > 0 ? (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha de Suscripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribersQuery.data.map((subscriber) => (
                        <tr key={subscriber.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{subscriber.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{subscriber.name || "-"}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(subscriber.subscribedAt).toLocaleDateString("es-ES")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-gray-600">No hay suscriptores aún</p>
              </Card>
            )}
          </div>
        )}

        {/* Create Newsletter Tab */}
        {activeTab === "create" && (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Form */}
            <div className="md:col-span-2">
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-[#003366] mb-6">Crear Newsletter</h2>
                <form onSubmit={handleCreateCampaign} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Asunto</label>
                    <Input
                      type="text"
                      value={campaignSubject}
                      onChange={(e) => setCampaignSubject(e.target.value)}
                      placeholder="Ej: Nuevos eventos de IPA Xerez"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contenido</label>
                    <Textarea
                      value={campaignContent}
                      onChange={(e) => setCampaignContent(e.target.value)}
                      placeholder="Escribe el contenido del newsletter aquí..."
                      className="w-full h-64"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center gap-2"
                    >
                      {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showPreview ? "Ocultar" : "Ver"} Previsualización
                    </Button>
                    <Button
                      type="submit"
                      disabled={createCampaignMutation.isPending}
                      className="bg-[#D4AF37] text-[#003366] hover:bg-[#FFD700]"
                    >
                      {createCampaignMutation.isPending ? "Guardando..." : "Guardar como Borrador"}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="md:col-span-1">
                <Card className="p-6 bg-white border-2 border-[#D4AF37]">
                  <h3 className="text-lg font-bold text-[#003366] mb-4">Previsualización</h3>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <h4 className="font-bold text-[#003366] mb-2">{campaignSubject || "Asunto del newsletter"}</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{campaignContent || "El contenido aparecerá aquí..."}</p>
                  </div>
                </Card>
              </div>
            )}

            {/* Campaigns List */}
            <div className="md:col-span-3">
              <h2 className="text-2xl font-bold text-[#003366] mb-6">Newsletters Guardados</h2>
              {campaignsQuery.isLoading ? (
                <div className="text-center py-8">Cargando newsletters...</div>
              ) : campaignsQuery.data && campaignsQuery.data.length > 0 ? (
                <div className="space-y-4">
                  {campaignsQuery.data.map((campaign) => (
                    <Card key={campaign.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[#003366]">{campaign.subject}</h3>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{campaign.content}</p>
                          <div className="flex gap-4 mt-4 text-sm text-gray-600">
                            <span>Estado: <strong>{campaign.status}</strong></span>
                            {campaign.sentAt && (
                              <span>Enviado: {new Date(campaign.sentAt).toLocaleDateString("es-ES")}</span>
                            )}
                            {campaign.recipientCount && (
                              <span>Destinatarios: <strong>{campaign.recipientCount}</strong></span>
                            )}
                          </div>
                        </div>
                        {campaign.status === "draft" && (
                          <Button
                            onClick={() => handleSendCampaign(campaign.id)}
                            disabled={sendingCampaignId === campaign.id || sendCampaignMutation.isPending}
                            className="bg-green-600 text-white hover:bg-green-700 ml-4"
                          >
                            {sendingCampaignId === campaign.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Enviando...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Enviar
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-gray-600">No hay newsletters guardados</p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
