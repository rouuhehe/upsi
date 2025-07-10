import { GuideList } from "../components/GuideList";
import { GuideSidebar } from "../components/GuideSidebar";
import { useState, useEffect } from "react";
import type { GuideType } from "../types/GuideType";

export const GuidePage = () => {
  const [filterType, setFilterType] = useState<GuideType | "">("");
  const [filterAge, setFilterAge] = useState<"latest" | "oldest" | "">("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);

  return (
    <div className="flex md:flex-row min-h-screen relative bg-[var(--c-bg)]">
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
        />
      )}

      {!isSidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="font-semibold fixed bottom-8 right-6 z-40 py-2 p-4 flex items-center justify-center bg-sky-500 text-white rounded-full shadow-lg hover:bg-sky-600 transition md:hidden"
        >
          Filtros
        </button>
      )}

      <aside
        className={`
          fixed md:sticky h-screen top-0 left-0 z-40 transform transition-transform duration-300
          bg-[var(--c-bg)] md:translate-x-0 shadow-lg
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="h-auto flex flex-col justify-between overflow-y-auto">
          <GuideSidebar
            filterType={filterType}
            setFilterType={setFilterType}
            filterAge={filterAge}
            setFilterAge={setFilterAge}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </aside>

      <div className="flex-1 py-8">
        <GuideList
          filterType={filterType}
          setFilterType={setFilterType}
          filterAge={filterAge}
          setFilterAge={setFilterAge}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
    </div>
  );
};
