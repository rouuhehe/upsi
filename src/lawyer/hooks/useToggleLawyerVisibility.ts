import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, wrap } from "../../utils/api";

export const useToggleLawyerVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isPublic: boolean) =>
      (
        await wrap<void>(
          apiClient.toggleLawyerVisibility({ query: { isPublic } }),
        )
      )._unsafeUnwrap(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-lawyer-profile"] });
    },
  });
};
