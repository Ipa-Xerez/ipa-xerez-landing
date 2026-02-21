import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Mail, FileText, ExternalLink } from "lucide-react";

export default function Inscription() {
  const [, navigate] = useLocation();
  const IPA_OFFICIAL_FORM = "https://ipa-international.org/membership/join";

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      window.location.href = IPA_OFFICIAL_FORM;
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#003366] to-[#001a33] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="inline-block bg-[#D4AF37] rounded-full p-4 mb-6">
            <FileText className="w-8 h-8 text-[#003366]" />
          </div>
          <h1 className="text-4xl font-bold text-[#003366] mb-4">
            Formulario Oficial de IPA
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Serás redirigido al formulario oficial de la International Police Association
          </p>
        </div>

        <div className="bg-blue-50 border-l-4 border-[#003366] p-6 mb-8 rounded">
          <h2 className="text-lg font-semibold text-[#003366] mb-3">
            ¿Qué necesitas para inscribirte?
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center gap-3">
              <span className="text-[#D4AF37]">✓</span>
              Ser miembro activo o jubilado de fuerzas de seguridad
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#D4AF37]">✓</span>
              Completar el formulario oficial de IPA
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#D4AF37]">✓</span>
              Pagar la cuota de membresía correspondiente
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#D4AF37]">✓</span>
              Ser aprobado por la agrupación local (IPA Xerez)
            </li>
          </ul>
        </div>

        <div className="bg-amber-50 border-l-4 border-[#D4AF37] p-6 mb-8 rounded">
          <h2 className="text-lg font-semibold text-[#003366] mb-3">
            Contacto IPA Xerez
          </h2>
          <p className="text-gray-700 mb-4">
            Si tienes preguntas sobre el proceso de inscripción, puedes contactarnos:
          </p>
          <div className="space-y-2">
            <a
              href="https://wa.me/34675508110"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
            >
              <span>📱</span> WhatsApp: +34 675 508 110
            </a>
            <a
              href="mailto:ipaagrupacionxerez@gmail.com"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <Mail className="w-5 h-5" />
              Email: ipaagrupacionxerez@gmail.com
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.location.href = IPA_OFFICIAL_FORM}
            className="bg-[#D4AF37] text-[#003366] hover:bg-[#C4991F] text-lg px-8 py-6 font-bold flex items-center gap-2"
          >
            <ExternalLink className="w-5 h-5" />
            Ir al Formulario Oficial
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-2 border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white text-lg px-8 py-6 font-bold"
          >
            Volver al Inicio
          </Button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Serás redirigido automáticamente en 3 segundos...
        </p>
      </div>
    </div>
  );
}
