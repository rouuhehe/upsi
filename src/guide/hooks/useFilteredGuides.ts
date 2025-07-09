import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../utils/api";
import type { GuideType } from "../types/GuideType";
import { useMemo } from "react";

interface UseFilteredGuidesOptions {
  typeFilter: GuideType | "";
  searchTerm: string;
  ageFilter: "latest" | "oldest" | "";
}

export function useFilteredGuides({
  typeFilter,
  searchTerm,
  ageFilter,
}: UseFilteredGuidesOptions) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["guides"],
    queryFn: () => apiClient.listGuides(),
  });

  const filteredGuides = useMemo(() => {
    if (!data) return [];
    let guides = [...data];

    if (typeFilter) {
      guides = guides.filter((guide) => guide.type === typeFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      guides = guides.filter(
        (guide) =>
          guide.title.toLowerCase().includes(term) ||
          guide.content.toLowerCase().includes(term),
      );
    }

    if (ageFilter === "latest") {
      guides.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    } else if (ageFilter === "oldest") {
      guides.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    }

    return guides;
  }, [data, typeFilter, searchTerm, ageFilter]);

  return {
    allGuides: data ?? [],
    guides: filteredGuides,
    isLoading,
    isError,
  };
}
