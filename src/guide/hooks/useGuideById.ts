import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../utils/api";

export function useGuideById(id: string | undefined) {
  return useQuery({
    queryKey: ["guide", id],
    queryFn: () => {
      if (!id) throw new Error("ID requerido");
      return apiClient.getGuideById({ params: { id } });
    },
    enabled: !!id,
  });
}
