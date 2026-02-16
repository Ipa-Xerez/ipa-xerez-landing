import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface BackButtonProps {
  label?: string;
  className?: string;
}

export default function BackButton({ label = "Volver a Inicio", className = "" }: BackButtonProps) {
  const [, navigate] = useLocation();

  return (
    <button
      onClick={() => navigate("/")}
      className={`flex items-center gap-2 text-[#003366] hover:text-[#1A3A52] transition-colors font-semibold ${className}`}
    >
      <ArrowLeft className="w-5 h-5" />
      {label}
    </button>
  );
}
