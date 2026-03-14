import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const [, navigate] = useLocation();

  return (
    <nav className={`flex items-center gap-2 text-sm text-gray-600 ${className}`}>
      <button
        onClick={() => navigate("/")}
        className="text-[#003366] hover:text-[#1A3A52] transition-colors font-semibold"
      >
        Inicio
      </button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.href ? (
            <button
              onClick={() => navigate(item.href!)}
              className="text-[#003366] hover:text-[#1A3A52] transition-colors font-semibold"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-600">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
