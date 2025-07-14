import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ImageResponse } from "../types/ImageResponse";
import { apiClient, wrap } from "../../utils/api";
import { uploadProfileImage } from "../services/uploadProfileImage";

export function useProfileImage() {
  const queryClient = useQueryClient();

  const {
    data: image,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["profileImage"],
    queryFn: async () => {
      const result = await wrap<ImageResponse>(apiClient.getProfileImage());
      if (result.isOk()) {
        return result.value;
      }

      return null;
    },
    retry: false,
  });
  console.log(image);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const result = await uploadProfileImage(file);
      if (result.isOk()) {
        return result.value;
      }
      throw new Error(result.error.message);
    },
    onSuccess: (data: ImageResponse) => {
      queryClient.setQueryData(["profileImage"], data);
      queryClient.invalidateQueries({ queryKey: ["profileImage"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const result = await wrap(apiClient.deleteProfileImage());
      if (result.isOk()) {
        return result.value;
      }
      throw new Error(result.error.message);
    },
    onSuccess: () => {
      queryClient.setQueryData(["profileImage"], null);
      queryClient.invalidateQueries({ queryKey: ["profileImage"] });
    },
  });

  return {
    image,
    isLoading,
    isError,
    error,

    uploadImage: uploadMutation.mutate,
    deleteImage: deleteMutation.mutate,

    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    uploadError: uploadMutation.error,
    deleteError: deleteMutation.error,
  };
}