import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../utils/api";
import { LawyerResponseArraySchema } from "../schemas/LawyerResponseSchema";

export const usePublicLawyers = () => {
  return useQuery({
    queryKey: ["public-lawyers"],
    queryFn: async () => {
      const data = await apiClient.get("/api/lawyers/public", {});
      return LawyerResponseArraySchema.parse(data);
    },
  });
};
