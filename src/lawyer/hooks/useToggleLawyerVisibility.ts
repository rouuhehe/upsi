import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../utils/api";

export const useToggleLawyerVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isPublic: boolean) =>
      apiClient.patch("/api/lawyers/me/visibility", undefined, {
        queries: { isPublic },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-lawyer-profile"] });
    },
  });
};
