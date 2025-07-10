import { useQuery } from "@tanstack/react-query";
import { apiClient, wrap } from "../../utils/api";
import {
  LawyerResponseSchema,
  type LawyerResponse,
} from "../schemas/LawyerResponseSchema";

export const useMyLawyerProfile = () => {
  return useQuery({
    queryKey: ["my-lawyer-profile"],
    queryFn: async () => {
      const data = (
        await wrap<LawyerResponse>(apiClient.findLawyerMe())
      )._unsafeUnwrap();
      return LawyerResponseSchema.parse(data);
    },
    retry: false,
  });
};
