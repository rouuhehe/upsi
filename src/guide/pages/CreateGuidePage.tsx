import { useState } from "react";
import GuideEditor from "../components/GuideEditor";
import { GuideTitleInput } from "../components/GuideTitleInput";
import { GuideTypeSelector } from "../components/GuideTypeSelector";
import { GuideSubmitButton } from "../components/GuideSubmitButton";
import type { GuideType } from "../schemas/GuideTypeSchema";
import { useCreateGuide } from "../hooks/useCreateGuide";
import { validateGuideContent } from "../services/validateGuideContent";
import ReactMarkdown from "react-markdown";

export default function CreateGuidePage() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<GuideType>("CRIMINAL");
  const [content, setContent] = useState("");

  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [validationFeedback, setValidationFeedback] = useState<string | null>(null);

  const { create, isSubmitting, errors } = useCreateGuide();

  const handleValidation = async () => {
    setIsValidating(true);
    setValidationFeedback(null);
    setIsValidated(false);

    const result = await validateGuideContent(content);

    setIsValidating(false);

    if (result.isErr()) {
      setValidationFeedback("No se pudo validar el contenido. Intenta nuevamente.");
      return;
    }

    const feedback = result.value;
    setValidationFeedback(feedback);

    const isValid = feedback.trim().toLowerCase() === "contenido válido";
    setIsValidated(isValid);
  };


  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isValidated) return;
    create({ title, type, content });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 px-4 py-20">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 flex items-center justify-center bg-sky-400 rounded-3xl shadow-md">
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--c-text)] mb-2 leading-tight">
              Crear Nueva Guía Legal
            </h1>
            <p className="text-lg md:text-xl text-[var(--c-text)]/70 max-w-3xl leading-relaxed">
              Comparte tus conocimientos legales de manera clara y precisa.
              Verifica siempre la información antes de publicar.
            </p>
          </div>
        </div>

        <GuideTitleInput value={title} onChange={setTitle} error={errors.title} />
        <GuideEditor value={content} onChange={setContent} />
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
              <ReactMarkdown>
                {validationFeedback}
              </ReactMarkdown>
            </div>
          </div>
        )}


        <GuideSubmitButton
          isSubmitting={isSubmitting || isValidating}
          onClick={isValidated ? handleSubmit : handleValidation}
          label={isValidated ? "Publicar guía" : "Validar contenido con IA"}
        />
      </form>
    </>
  );
}
