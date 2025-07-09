// src/lawyer/components/LawyerFilterSidebar.tsx
import { ProvinceSchema } from "../schemas/ProvinceSchema";
import type { LawyerFilters } from "../hooks/useLawyerFilters";
import { LawyerSpecializationLabels } from "../schemas/lawyerLabels";

type Props = {
  filters: LawyerFilters;
  setFilters: React.Dispatch<React.SetStateAction<LawyerFilters>>;
};

export function LawyerFilterSidebar({ filters, setFilters }: Props) {
  const specializations = Object.entries(LawyerSpecializationLabels);
  const provinces = ProvinceSchema.options;

  return (
    <aside className="mt-12 md:mt-12 lg:mt-12 fixed left-0 top-0 w-[280px] h-screen bg-[var(--c-bg)] shadow-xl overflow-hidden">
      <div className="p-6 md:p-6 lg:p-6 h-full overflow-y-auto">
        <div className="mb-2">
          <h1 className="text-xl font-bold text-[var(--c-text)]">Filtros</h1>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--c-text)] mb-3 uppercase tracking-wide">
              Especialización
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {specializations.map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center group cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.specializations.includes(key)}
                      onChange={() =>
                        setFilters((prev) => ({
                          ...prev,
                          specializations: prev.specializations.includes(key)
                            ? prev.specializations.filter((s) => s !== key)
                            : [...prev.specializations, key],
                        }))
                      }
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-md border transition-all duration-200 ${
                        filters.specializations.includes(key)
                          ? "bg-sky-400 border-sky-400"
                          : "border-[var(--c-text)]/30 group-hover:border-sky-400"
                      }`}
                    >
                      {filters.specializations.includes(key) && (
                        <svg
                          className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-[var(--c-text)] group-hover:text-sky-400 transition-colors">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--c-text)] mb-3 uppercase tracking-wide">
              Ubicación
            </h3>
            <select
              value={filters.provinces[0] || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  provinces: e.target.value ? [e.target.value] : [],
                }))
              }
              className="w-full px-4 py-3 bg-[var(--c-bg-hover)] border border-[var(--c-bg-hover)] rounded-xl text-[var(--c-text)] focus:outline-none focus:ring-2 focus:ring-sky-400 backdrop-blur-sm transition-all duration-200"
            >
              <option value="">Todas las provincias</option>
              {provinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov === "LIMA"
                    ? "Lima"
                    : prov === "OTHER"
                      ? "Fuera de Lima"
                      : prov}
                </option>
              ))}
            </select>
          </div>

          {/* Experiencia */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--c-text)] mb-3 uppercase tracking-wide">
              Experiencia Mínima
            </h3>
            <div className="relative">
              <input
                type="number"
                min={0}
                value={filters.minExperience ?? ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minExperience: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  }))
                }
                placeholder="Años de experiencia"
                className="w-full px-4 py-3 bg-[var(--c-bg-hover)] border border-[var(--c-bg-hover)] rounded-xl text-[var(--c-text)] placeholder-[var(--c-text)]/60 focus:outline-none focus:ring-2 focus:ring-sky-400 backdrop-blur-sm transition-all duration-200"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-[var(--c-text)]/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Precio */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--c-text)] mb-3 uppercase tracking-wide">
              Precio Máximo
            </h3>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={filters.maxPrice ?? 200}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: parseInt(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-[var(--c-bg-hover)] rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, rgb(56 189 248) 0%, rgb(56 189 248) ${((filters.maxPrice ?? 200) / 500) * 100}%, var(--c-bg-hover) ${((filters.maxPrice ?? 200) / 500) * 100}%, var(--c-bg-hover) 100%)`,
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--c-text)]/60">PEN 0</span>
                <div className="bg-sky-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  PEN {filters.maxPrice ?? 200}
                </div>
                <span className="text-sm text-[var(--c-text)]/60">PEN 500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botón para limpiar filtros */}
        <div className="mt-8 pt-6 border-t border-[var(--c-text)]/10">
          <button
            onClick={() =>
              setFilters({
                specializations: [],
                provinces: [],
                minExperience: null,
                maxPrice: null,
                orderBy: "price-asc",
              })
            }
            className="w-full px-4 py-3 bg-transparent border-2 border-sky-400 text-sky-400 rounded-xl font-semibold hover:bg-sky-400 hover:text-white transition-all duration-200 flex items-center justify-center space-x-2"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Limpiar Filtros</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
