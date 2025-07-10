import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadProfileImage } from "../services/uploadProfileImage";
import { getProfileImage } from "../services/getProfileImage";
import { deleteProfileImage } from "../services/deleteProfileImage";
import type { ImageResponse } from "../types/ImageResponse";

export function useProfileImage() {
  const queryClient = useQueryClient();

  // Query para obtener la imagen actual
  const {
    data: image,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["profileImage"],
    queryFn: async () => {
      const result = await getProfileImage();
      if (result.isOk()) {
        return result.value;
      }
      // Si hay error, retornamos null en lugar de throw
      return null;
    },
    retry: false,
  });
    console.log(image); // 

  // Mutation para subir imagen
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

  // Mutation para eliminar imagen
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const result = await deleteProfileImage();
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
    // Data
    image,
    isLoading,
    isError,
    error,

    // Actions
    uploadImage: uploadMutation.mutate,
    deleteImage: deleteMutation.mutate,

    // States
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    uploadError: uploadMutation.error,
    deleteError: deleteMutation.error,
  };
}
