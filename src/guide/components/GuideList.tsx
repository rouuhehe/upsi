import { useNavigate } from "react-router-dom";
import GuideCard from "./GuideCard";
import { useFilteredGuides } from "../hooks/useFilteredGuides";
import type { GuideType } from "../types/GuideType";
import { GuideTypeLabels } from "../constants/guideLabels";
import { useCurrentUser } from "../../user/hooks/useCurrentUser";

interface GuideListProps {
  filterType: GuideType | "";
  filterAge: "latest" | "oldest" | "";
  searchTerm: string;
}

export const GuideList = ({
  filterType,
  filterAge,
  searchTerm,
}: GuideListProps) => {
  const navigate = useNavigate();
  const { user: currentUser } = useCurrentUser();
  const isLawyerOrAdmin = currentUser?.roles?.some(
    (role) => role === "ADMIN" || role === "LAWYER",
  );

  const {
    guides: filteredGuides,
    isLoading,
    isError,
  } = useFilteredGuides({
    typeFilter: filterType,
    ageFilter: filterAge,
    searchTerm: searchTerm,
  });

  return (
    <main className="flex-1 px-6 min-h-screen relative overflow-hidden">
      <div className="relative z-10">
        {/* Estados de carga y error */}
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white/80"></div>
              <p className="text-white/80 text-lg font-medium">
                Cargando guías...
              </p>
            </div>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[var(--c-bg-hover)] rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[var(--c-text)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-[var(--c-text)] text-lg font-medium">
                Error al cargar guías
              </p>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h1 className="mt-12 text-3xl font-bold text-[var(--c-text)] mb-2">
                Todas las guías
              </h1>
              <p className="text-[var(--c-text)]/70 mb-6">
                Explora nuestra biblioteca de guías legales y encuentra
                soluciones para tus dudas legales.
              </p>
            </div>
            {(filterType || filterAge || searchTerm) && (
              <div className=" mt-3 flex flex-wrap items-center gap-3 p-6 bg-[var(--c-bg-hover)] backdrop-blur-md rounded-2xl ">
                <div className="flex items-center space-x-2 text-[var(--c-text)]/80">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Filtros activos:</span>
                </div>

                <div className="flex flex-wrap gap-2 overflow-hidden">
                  {filterType && (
                    <span className="px-4 py-2 bg-gradient-to-r from-sky-400 to-sky-500 text-white rounded-full text-sm font-medium shadow-lg">
                      {GuideTypeLabels[filterType]}
                    </span>
                  )}
                  {filterAge && (
                    <span className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white rounded-full text-sm font-medium shadow-lg">
                      {filterAge === "latest" ? "Recientes" : "Antiguas"}
                    </span>
                  )}
                  {searchTerm.trim() !== "" && (
                    <span
                      className="inline-block max-w-xs truncate px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-full text-sm font-medium shadow-lg"
                      title={`Término de búsqueda: ${searchTerm}`}
                    >
                      “{searchTerm}”
                    </span>
                  )}
                </div>

                <button
                  onClick={() => navigate("/guides")}
                  className="ml-auto group flex items-center space-x-2 px-4 py-2 bg-[var(--c-text-soft)]/45 hover:bg-white/30 text-white rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  <svg
                    className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Limpiar filtros</span>
                </button>
              </div>
            )}

            {/* Lista o mensaje de vacío */}
            {filteredGuides.length === 0 ? (
              <div className="text-center py-24">
                <div className="relative">
                  <div className="w-25 h-25 mx-auto mb-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-sky-600/20 rounded-full"></div>
                    <div className="absolute inset-2  rounded-full flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-sky-400 "
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="max-w-md mx-auto">
                    <h3 className="text-3xl font-bold text-[var(--c-text)] mb-4">
                      {searchTerm
                        ? "No se encontraron guías"
                        : "No hay guías disponibles"}
                    </h3>
                    {searchTerm && (
                      <p className="text-[var(--c-text)]/70 mb-8 text-lg leading-relaxed">
                        {isLawyerOrAdmin
                          ? "Comienza tu biblioteca de conocimiento creando tu primera guía legal"
                          : "Intenta con otros términos de búsqueda o ajusta los filtros"}
                      </p>
                    )}

                    {isLawyerOrAdmin && (
                      <button
                        onClick={() => navigate("/guides/new")}
                        className="group relative overflow-hidden inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                      >
                        <svg
                          className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span className="relative z-10">Crear Guía</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-8 mt-10">
                {filteredGuides.map((guide, index) => (
                  <div
                    key={guide.id}
                    className="animate-fadeInUp"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <GuideCard {...guide} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Estilos CSS para la animación */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </main>
  );
};
