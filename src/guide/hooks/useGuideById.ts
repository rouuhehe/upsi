import { useQuery } from "@tanstack/react-query";
import { apiClient, wrap } from "../../utils/api";
import type { Guide } from "../types/Guide";

export function useGuideById(id: string | undefined) {
  return useQuery({
    queryKey: ["guide", id],
    queryFn: async () => {
      if (!id) throw new Error("ID requerido");
      return (
        await wrap<Guide>(apiClient.getGuideById({ params: { id } }))
      )._unsafeUnwrap();
    },
    enabled: !!id,
  });
}
