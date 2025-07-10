import { useQuery } from "@tanstack/react-query";
import { apiClient, wrap } from "../../utils/api";
import {
  LawyerResponseArraySchema,
  type LawyerResponseArray,
} from "../schemas/LawyerResponseSchema";

export const usePublicLawyers = () => {
  return useQuery({
    queryKey: ["public-lawyers"],
    queryFn: async () => {
      const data = (
        await wrap<LawyerResponseArray>(apiClient.listPublicLawyers())
      )._unsafeUnwrap();
      return LawyerResponseArraySchema.parse(data);
    },
  });
};
