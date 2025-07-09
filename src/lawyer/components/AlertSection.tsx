import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

export const AlertSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-[var(--c-dropdown-bg)] border border-[var(--c-border)]/60 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="relative flex items-start gap-4">
        <div className="flex-shrink-0 relative">
          <div className="absolute inset-0 bg-sky-400/30 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
          <div className="relative bg-sky-400 p-3 rounded-full shadow-lg">
            <Sparkles className="text-white w-5 h-5" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-lg text-[var(--c-text)]">
              ¿Te gustaría aparecer en esta lista?
            </h3>
          </div>

          <p className="text-[var(--c-text)] mb-4 leading-relaxed">
            Activa tu visibilidad pública para recibir comentarios,
            solicitudes de contacto y destacar tu perfil profesional.
          </p>

          <button
            onClick={() => navigate("/profile")}
            className="group/btn relative overflow-hidden bg-sky-400 hover:from-sky-600 hover:to-sky-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-sky-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-2">
              <span>Ir a mi perfil</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
