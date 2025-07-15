import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GuideTitleInput } from "../components/GuideTitleInput";
import { GuideTypeSelector } from "../components/GuideTypeSelector";
import { GuideSubmitButton } from "../components/GuideSubmitButton";
import GuideEditor from "../components/GuideEditor";
import { useGuideById } from "../hooks/useGuideById";
import { useUpdateGuide } from "../hooks/useUpdateGuide";
import type { GuideType } from "../schemas/GuideTypeSchema";
import { validateGuideContent } from "../services/validateGuideContent";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

export default function EditGuidePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: guide, isLoading } = useGuideById(id);
  const { update, isSubmitting, errors } = useUpdateGuide();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<GuideType>("CRIMINAL");
  const [content, setContent] = useState("");

  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [validationFeedback, setValidationFeedback] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (guide) {
      setTitle(guide.title);
      setType(guide.type);
      setContent(guide.content);
      setIsValidated(false);
      setValidationFeedback(null);
    }
  }, [guide]);

  const handleValidation = async () => {
    setIsValidating(true);
    setValidationFeedback(null);
    setIsValidated(false);

    const result = await validateGuideContent(content);
    setIsValidating(false);

    if (result.isErr()) {
      setValidationFeedback(
        "No se pudo validar el contenido. Intenta nuevamente."
      );
      return;
    }

    const feedback = result.value;
    setValidationFeedback(feedback);
    const isValid = feedback.trim().toLowerCase() === "contenido válido";
    setIsValidated(isValid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !isValidated) return;

    try {
      await update({ id, title, type, content });
      toast.success("Guía actualizada");
      navigate(`/guides/${id}`);
    } catch {
      toast.error("No se pudo actualizar la guía");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-slate-600">Cargando guía para editar...</p>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-600">No se encontró la guía.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto space-y-8 px-4 py-20"
    >
      <div className="flex items-center gap-6 mb-12">
        <div className="w-20 h-20 flex items-center justify-center bg-sky-500 rounded-3xl shadow-md">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M18.5 2.5l3 3L12 15l-4 1 1-4 9.5-9.5z"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--c-text)] mb-2 leading-tight">
            Editar Guía Legal
          </h1>
          <p className="text-lg md:text-xl text-[var(--c-text)]/70 max-w-3xl leading-relaxed">
            Realiza las modificaciones necesarias. Verifica que la información
            esté actualizada y bien redactada antes de guardar los cambios.
          </p>
        </div>
      </div>

      <GuideTitleInput value={title} onChange={setTitle} error={errors.title} />
      <GuideTypeSelector value={type} onChange={setType} />

      {validationFeedback && (
        <div
          className={`rounded-lg p-4 text-sm mt-4 border ${
            isValidated
              ? "bg-green-500/10 text-green-700 border-green-200"
              : "bg-red-500/10 text-red-700 border-red-200"
          }`}
        >
          <p className="font-semibold mb-2">
            {isValidated ? "Contenido válido" : "Contenido requiere mejoras"}
          </p>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{validationFeedback}</ReactMarkdown>
          </div>
        </div>
      )}

      <GuideEditor value={content} onChange={setContent} />

      <div className="flex justify-center">
        <GuideSubmitButton
          isSubmitting={isSubmitting || isValidating}
          onClick={isValidated ? undefined : handleValidation}
          label={isValidated ? "Guardar cambios" : "Validar contenido"}
        />
      </div>
    </form>
  );
}
