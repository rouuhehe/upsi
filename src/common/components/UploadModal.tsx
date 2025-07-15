import { useRef, useState, useEffect } from "react";
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  FileUp,
  CheckCircle,
  Trash2,
  Cloud,
} from "lucide-react";
import { apiClient } from "../../utils/api";

interface UploadModalProps {
  onExtracted: (text: string) => void;
}

interface FileState {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  extractedText: string;
}

export function UploadModal({ onExtracted }: UploadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<FileState[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleFiles = (newFiles: File[]) => {
    newFiles.forEach((file) => {
      const id = crypto.randomUUID();
      const fileState: FileState = {
        id,
        file,
        progress: 0,
        status: "uploading",
        extractedText: "",
      };
      setFiles((prev) => [...prev, fileState]);

      const simulateProgress = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id && f.progress < 90
              ? { ...f, progress: f.progress + 10 }
              : f
          )
        );
      }, 200);

      const form = new FormData();
      form.append("file", file);

      const request =
        file.type === "application/pdf"
          ? apiClient.uploadOcrPdf({ body: form })
          : apiClient.uploadOcrImage({ body: form });

      request
        .then((res) => {
          clearInterval(simulateProgress);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? {
                    ...f,
                    progress: 100,
                    status: "completed",
                    extractedText:
                      typeof res.body === "string"
                        ? res.body
                        : JSON.stringify(res.body),
                  }
                : f
            )
          );
        })
        .catch(() => {
          clearInterval(simulateProgress);
          setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, status: "error" } : f))
          );
        });
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleConfirm = () => {
    const text = files.map((f) => f.extractedText).join("\n\n");
    onExtracted(text);
    setFiles([]);
    setIsOpen(false);
  };

  const getIcon = (type: string) => {
    if (type.includes("pdf"))
      return <FileText className="w-6 h-6 text-red-500" />;
    if (type.includes("image"))
      return <ImageIcon className="w-6 h-6 text-blue-500" />;
    return <FileText className="w-6 h-6 text-gray-400" />;
  };

  return (
    <>
      {!isOpen && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-10 py-2.5 rounded-md bg-sky-400 border border-[var(--c-border)] text-white hover:bg-sky-500 transition font-semibold"
          >
            <FileUp className="w-4 h-4" />
            <span className="hidden sm:inline">Subir archivo</span>
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto p-4">
            <div className="bg-[var(--c-dropdown-bg)] pointer-events-auto rounded-xl shadow-lg w-full p-6 relative space-y-6">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setFiles([]);
                }}
                className="cursor-pointer text-[var(--c-text)]/50 hover:bg-[var(--c-trash-bg)]/70 p-1 rounded-full hover:text-red-500 items-end absolute top-4 right-4"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <Cloud className="w-10 h-10 text-[var(--c-text)]/70" />
                <div>
                  <h2 className="text-lg font-semibold text-[var(--c-text)]">
                    Subir archivos
                  </h2>
                  <p className="text-sm text-[var(--c-text)]/70">
                    Escoge y sube los archivos de tu elección
                  </p>
                </div>
              </div>

              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
              >
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-3" />
                <p className="text-[var(--c-text)]/70 mb-1">
                  Escoge un archivo o arrástralo aquí
                </p>
                <p className="text-sm text-[var(--c-text)]/60 mb-4">
                  JPEG, PNG, PDF – hasta 50 MB
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,image/*"
                  multiple
                  onChange={(e) =>
                    e.target.files && handleFiles(Array.from(e.target.files))
                  }
                  className="hidden"
                />
                <button
                  onClick={handleBrowse}
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-gray-700 font-semibold"
                >
                  Buscar archivos
                </button>
              </div>

              {files.length > 0 && (
                <div className="space-y-3">
                  {files.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center gap-3 p-3 bg-[var(--c-border)]/60 rounded-lg"
                    >
                      {getIcon(f.file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--c-text)] truncate">
                          {f.file.name}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-[var(--c-text)]/60">
                          <span>{(f.file.size / 1024).toFixed(0)} KB</span>
                          <span>•</span>
                          {f.status === "uploading" && "Uploading..."}
                          {f.status === "completed" && (
                            <span className="flex items-center text-green-600">
                              <CheckCircle className="w-4 h-4 mr-1" /> Completed
                            </span>
                          )}
                          {f.status === "error" && (
                            <span className="text-red-500">Error</span>
                          )}
                        </div>
                        {f.status === "uploading" && (
                          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                            <div
                              className="h-1 bg-blue-500 rounded-full"
                              style={{ width: `${f.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFile(f.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-[var(--c-trash-bg)]/70 p-1 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {files.length > 0 &&
                files.every((f) => f.status === "completed") && (
                  <button
                    onClick={handleConfirm}
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-lg py-2 font-medium"
                  >
                    Confirmar
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
