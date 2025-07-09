import { useState } from "react";

export type LawyerFilters = {
  specializations: string[];
  provinces: string[];
  minExperience: number | null;
  maxPrice: number | null;
  orderBy: "price-asc" | "experience-desc";
};

export const useLawyerFilters = () => {
  const [filters, setFilters] = useState<LawyerFilters>({
    specializations: [],
    provinces: [],
    minExperience: null,
    maxPrice: null,
    orderBy: "price-asc",
  });

  return { filters, setFilters };
};
