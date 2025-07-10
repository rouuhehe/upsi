import { usePublicLawyers } from "../hooks/usePublicLawyers";
import { LawyerCard } from "../components/LawyerCard";
import { LawyerFilterSidebar } from "../components/LawyerFilterSidebar";
import { useLawyerFilters } from "../hooks/useLawyerFilters";
import { useMemo, useState, useEffect } from "react";
import { AlertSection } from "./AlertSection";
import { useMyLawyerProfile } from "../hooks/useMyLawyerProfile";

export default function LawyerListPage() {
  const { data: lawyers, isLoading, isError, error } = usePublicLawyers();
  const { filters, setFilters } = useLawyerFilters();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { data: me, isSuccess } = useMyLawyerProfile();
  const showCta = isSuccess && me && !me.isPublic;

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);

  const filteredLawyers = useMemo(() => {
    if (!lawyers) return [];

    return [...lawyers]
      .filter((lawyer) => {
        if (
          filters.specializations.length &&
          !lawyer.specializations.some((spec) =>
            filters.specializations.includes(spec),
          )
        )
          return false;

        if (
          filters.provinces.length &&
          (!lawyer.province || !filters.provinces.includes(lawyer.province))
        )
          return false;

        if (
          filters.minExperience !== null &&
          lawyer.yearExperience < filters.minExperience
        )
          return false;

        if (filters.maxPrice !== null && lawyer.contactPrice > filters.maxPrice)
          return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.orderBy === "price-asc") {
          return a.contactPrice - b.contactPrice;
        } else {
          return b.yearExperience - a.yearExperience;
        }
      });
  }, [lawyers, filters]);

  const [currentPage, setCurrentPage] = useState(1);
  const lawyersPerPage = 6; // Cambiado de 1 a 6 para mejor UX

  const paginatedLawyers = useMemo(() => {
    const startIndex = (currentPage - 1) * lawyersPerPage;
    return filteredLawyers.slice(startIndex, startIndex + lawyersPerPage);
  }, [filteredLawyers, currentPage]);

  const totalPages = Math.ceil(filteredLawyers.length / lawyersPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredLawyers]);

  const hasActiveFilters =
    filters.specializations.length > 0 ||
    filters.provinces.length > 0 ||
    filters.minExperience !== null ||
    filters.maxPrice !== null;



  return (
    <div className="relative flex min-h-screen bg-[var(--c-bg)]">
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <div
        className={`
          fixed z-50 md:z-10 left-0 top-0 w-72 h-screen transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <LawyerFilterSidebar filters={filters} setFilters={setFilters} />
      </div>

      <button
        onClick={() => setSidebarOpen(true)}
        className="font-semibold fixed bottom-6 right-6 z-50 p-4 py-2 mb-3 bg-sky-500 text-white rounded-full shadow-lg hover:bg-sky-600 transition md:hidden"
      >
        Filtros
      </button>

      <main className="flex-1 p-8 md:ml-72">
        {showCta && (
          <div className="mb-8">
            <AlertSection />
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--c-text)] mb-2">
                Encuentra tu Abogado Ideal
              </h1>
              <p className="text-[var(--c-text)]/70">
                {filteredLawyers.length} abogados disponibles
                {totalPages > 1 && (
                  <span className="ml-2 text-sm">
                    (Página {currentPage} de {totalPages})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
              <span className="text-lg text-[var(--c-text)]/70">
                Cargando abogados...
              </span>
            </div>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-8 h-8 text-red-500"
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
                <div>
                  <h3 className="text-lg font-semibold text-red-800">
                    Error al cargar
                  </h3>
                  <p className="text-red-600">{String(error)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="space-y-6">
            {paginatedLawyers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-center max-w-md">
                  <h3 className="text-2xl font-bold text-[var(--c-text)] mb-4">
                    No se encontraron abogados
                  </h3>
                  <p className="text-[var(--c-text)]/70 mb-6">
                    {hasActiveFilters
                      ? "Intenta ajustar los filtros para encontrar abogados que se adapten a tus necesidades."
                      : "No hay abogados disponibles en este momento."}
                  </p>
                  {hasActiveFilters && (
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
                      className="inline-flex items-center px-4 py-2 bg-sky-400 hover:bg-sky-500 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
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
                      Limpiar filtros
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1  gap-6">
                  {paginatedLawyers.map((lawyer) => (
                    <div
                      key={lawyer.email}
                      className="transform transition-all duration-300 hover:scale-[1.02]"
                    >
                      <LawyerCard lawyer={lawyer} />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex flex-col items-center space-y-4 mt-12 pt-8 border-t border-[var(--c-text)]/10">
                    <div className="text-sm text-[var(--c-text)]/60 text-center">
                      Mostrando {((currentPage - 1) * lawyersPerPage) + 1} - {Math.min(currentPage * lawyersPerPage, filteredLawyers.length)} de {filteredLawyers.length} abogados
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center w-10 h-10 text-[var(--c-text)]/70 bg-white/5 rounded-full hover:bg-sky-50 hover:text-sky-400  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:text-[var(--c-text)]/70 disabled:hover:border-[var(--c-text)]/20 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      <div className="flex items-center space-x-2 text-sm text-[var(--c-text)]/70">
                        <span>{currentPage}</span>
                      </div>

                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center w-10 h-10 text-[var(--c-text)]/70 bg-white/5 rounded-full hover:bg-sky-400/20 hover:text-sky-400  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:text-[var(--c-text)]/70 disabled:hover:border-[var(--c-text)]/20 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>


                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}