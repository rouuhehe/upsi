import { GuideTypeLabels } from "../constants/guideLabels";
import type { GuideType } from "../types/GuideType";

interface GuideHeroProps {
  title: string;
  type: GuideType;
  createdAt: string;
  wordCount: number;
}

export const GuideHero = ({
  title,
  type,
  createdAt,
  wordCount,
}: GuideHeroProps) => {
  const getReadingTime = (words: number) => Math.ceil(words / 200);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-80"
          style={{ backgroundImage: "var(--c-chat-bg)" }}
        ></div>
        <div className="absolute inset-0 backdrop-blur-md"></div>
      </div>

      <div className="mt-4 relative max-w-5xl mx-auto px-6 py-16 text-center font-poppins">
        {/* Badge */}
        <div className="inline-flex items-center mb-6">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-500 shadow-lg">
            <span className="w-2 h-2 bg-white/50 rounded-full mr-2"></span>
            {GuideTypeLabels[type]}
          </span>
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--c-text)] mb-6 leading-tight">
          {title}
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-[var(--c-text)]/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            {new Date(createdAt).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            {getReadingTime(wordCount)} min de lectura
          </div>
        </div>
      </div>
    </div>
  );
};
