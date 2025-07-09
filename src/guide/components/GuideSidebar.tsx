import { useNavigate } from "react-router-dom";
import { GuideTypeLabels } from "../constants/guideLabels";
import type { GuideType } from "../types/GuideType";
import { useCurrentUser } from "../../user/hooks/useCurrentUser";
import type { Dispatch, SetStateAction } from "react";

interface GuideSidebarProps {
  filterType: GuideType | "";
  setFilterType: (type: GuideType | "") => void;
  filterAge: "latest" | "oldest" | "";
  setFilterAge: Dispatch<SetStateAction<"latest" | "oldest" | "">>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const GuideSidebar = ({
  filterType,
  setFilterType,
  filterAge,
  setFilterAge,
  searchTerm,
  setSearchTerm,
}: GuideSidebarProps) => {
  const navigate = useNavigate();
  const { user: currentUser } = useCurrentUser();

  const canCreateGuide =
    currentUser?.roles?.includes("LAWYER") ||
    currentUser?.roles?.includes("ADMIN");

  return (
    <aside className=" w-[280px] min-h-screen backdrop-blur-xl  shadow-xl">
      <div className="ml-4 mr-12  mt-16">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-[var(--c-text)]">
            Guías Legales
          </h1>
          <p className="text-sm text-[var(--c-text)]/80">
            Centro de conocimiento
          </p>
        </div>

        {canCreateGuide && (
          <button
            onClick={() => navigate("/guides/new")}
            className="cursor-pointer w-full mb-8 bg-sky-400 hover:bg-sky-500 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Nueva Guía</span>
          </button>
        )}

        {/* Búsqueda */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-[var(--c-text)] mb-3 uppercase tracking-wide">
            Buscar
          </h3>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar guías..."
              className="text-[var(--c-text)] w-full pl-12 pr-4 py-3 bg-[var(--c-bg-hover)] border border-[var(--c-bg-hover)] rounded-xl placeholder-[var(--c-text)] focus:outline-none focus:ring-2 focus:ring-sky-400 backdrop-blur-sm transition-all duration-200"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-[var(--c-text)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-[var(--c-text)] mb-3 uppercase tracking-wide">
              Especialización
            </h3>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as GuideType)}
              className="w-full px-4 py-3 bg-[var(--c-bg-hover)] border border-[var(--c-bg-hover)] rounded-xl text-[var(--c-text)] focus:outline-none focus:ring-2 focus:ring-sky-400 backdrop-blur-sm transition-all duration-200"
            >
              <option value="">Todas las especialidades</option>
              {Object.entries(GuideTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--c-text)] mb-3 uppercase tracking-wide">
              Ordenar por
            </h3>
            <select
              value={filterAge}
              onChange={(e) =>
                setFilterAge(e.target.value as "latest" | "oldest")
              }
              className="w-full px-4 py-3 bg-[var(--c-bg-hover)] border border-[var(--c-bg-hover)] rounded-xl text-[var(--c-text)] focus:outline-none focus:ring-2 focus:ring-sky-400 backdrop-blur-sm transition-all duration-200"
            >
              <option value="">Orden predeterminado</option>
              <option value="latest">Más recientes</option>
              <option value="oldest">Más antiguas</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
};
