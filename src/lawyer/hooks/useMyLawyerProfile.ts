import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../utils/api";
import { LawyerResponseSchema } from "../schemas/LawyerResponseSchema";

export const useMyLawyerProfile = () => {
  return useQuery({
    queryKey: ["my-lawyer-profile"],
    queryFn: async () => {
      const data = await apiClient.get("/api/lawyers/me");
      return LawyerResponseSchema.parse(data);
    },
    retry: false,
  });
};
