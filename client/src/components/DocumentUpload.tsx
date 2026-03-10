import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, AlertCircle, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface DocumentUploadProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const DOCUMENT_TYPES = [
  { value: "estatutos", label: "Estatutos" },
  { value: "actas_reuniones", label: "Actas de Reuniones" },
  { value: "comunicados_internos", label: "Comunicados Internos" },
  { value: "guias_manuales", label: "Guías y Manuales" },
  { value: "otros_documentos", label: "Otros Documentos" },
];

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function DocumentUpload({ onSuccess, onError }: DocumentUploadProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    documentType: "estatutos",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadDocumentMutation = trpc.documents.uploadAndCreate.useMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    // Validar tipo de archivo
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Tipo de archivo no permitido. Solo PDF, Word y Excel.");
      return;
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      setError("El archivo es demasiado grande. Máximo 10MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.title.trim()) {
      setError("El título es requerido");
      return;
    }

    if (!selectedFile) {
      setError("Selecciona un archivo");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Leer archivo como base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          // Simular progreso de carga
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              if (prev >= 90) {
                clearInterval(progressInterval);
                return prev;
              }
              return prev + Math.random() * 30;
            });
          }, 300);

          // Convertir a base64
          const base64Data = (reader.result as string).split(',')[1];

          // Usar el nuevo procedimiento uploadAndCreate que sube a S3
          const result = await uploadDocumentMutation.mutateAsync({
            title: formData.title,
            description: formData.description,
            documentType: formData.documentType,
            fileName: selectedFile.name,
            fileData: base64Data,
            isPublic: 0,
          });

          clearInterval(progressInterval);
          setUploadProgress(100);

          if (result) {
            setSuccess(true);
            setFormData({ title: "", description: "", documentType: "estatutos" });
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }

            setTimeout(() => {
              setSuccess(false);
              onSuccess?.();
            }, 2000);
          }
        } catch (err: any) {
          setError(err.message || "Error al subir el documento");
          onError?.(err.message);
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      setError(err.message || "Error al procesar el archivo");
      onError?.(err.message);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold text-[#003366] mb-6">Subir Nuevo Documento</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-semibold text-[#003366] mb-2">
            Título del Documento *
          </label>
          <Input
            type="text"
            name="title"
            placeholder="Ej: Estatutos de IPA Xerez 2025"
            value={formData.title}
            onChange={handleInputChange}
            disabled={isUploading}
            className="border-2 border-gray-300 focus:border-[#D4AF37]"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-[#003366] mb-2">
            Descripción (Opcional)
          </label>
          <Textarea
            name="description"
            placeholder="Describe brevemente el contenido del documento..."
            value={formData.description}
            onChange={handleInputChange}
            disabled={isUploading}
            rows={3}
            className="border-2 border-gray-300 focus:border-[#D4AF37]"
          />
        </div>

        {/* Tipo de Documento */}
        <div>
          <label className="block text-sm font-semibold text-[#003366] mb-2">
            Tipo de Documento *
          </label>
          <select
            name="documentType"
            value={formData.documentType}
            onChange={handleInputChange}
            disabled={isUploading}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
          >
            {DOCUMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Selección de Archivo */}
        <div>
          <label className="block text-sm font-semibold text-[#003366] mb-2">
            Archivo *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#D4AF37] transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              disabled={isUploading}
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 text-[#003366] hover:text-[#D4AF37] transition-colors"
            >
              <Upload className="w-6 h-6" />
              <span className="font-semibold">Selecciona un archivo</span>
            </button>
            <p className="text-xs text-gray-600 mt-2">
              PDF, Word o Excel • Máximo 10MB
            </p>
            {selectedFile && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                <span className="text-sm text-blue-700">{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-blue-700 hover:text-blue-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mensajes de Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Mensajes de Éxito */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">Documento subido exitosamente</p>
          </div>
        )}

        {/* Barra de Progreso */}
        {isUploading && uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-[#003366]">Subiendo...</span>
              <span className="text-sm text-gray-600">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isUploading || !selectedFile}
            className="flex-1 bg-[#003366] text-white hover:bg-[#002244] py-6 text-base font-semibold"
          >
            {isUploading ? "Subiendo..." : "Subir Documento"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => {
              setFormData({ title: "", description: "", documentType: "estatutos" });
              setSelectedFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
              setError("");
            }}
            className="border-2 border-gray-300 text-[#003366] hover:bg-gray-50"
          >
            Limpiar
          </Button>
        </div>
      </form>
    </div>
  );
}
