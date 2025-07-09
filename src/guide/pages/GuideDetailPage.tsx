import { useParams } from "react-router-dom";
import { useGuideById } from "../hooks/useGuideById";
import { GuideHero } from "../components/GuideHero";
import { GuideContent } from "../components/GuideContent";

export default function GuideDetailPage() {
  const { id } = useParams();
  const { data: guide, isLoading, isError } = useGuideById(id);

  if (isLoading) {
    return (
      <div className="mt-10 flex items-center justify-center min-h-screen">
        <p className="text-slate-500 text-xl">Cargando guía...</p>
      </div>
    );
  }

  if (isError || !guide) {
    return (
      <div className="mt-10 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 bg-white/80 px-10 py-8 rounded-xl shadow-md backdrop-blur">
          <p className="text-lg font-semibold text-slate-700">
            Guía no encontrada
          </p>
          <p className="text-slate-500">
            Verifica el enlace o regresa al listado de guías.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--c-bg)] text-[var(--c-text)]">
      <GuideHero
        title={guide.title}
        type={guide.type}
        createdAt={guide.createdAt}
        wordCount={guide.content.split(" ").length}
      />

      <GuideContent content={guide.content} />
    </main>
  );
}
