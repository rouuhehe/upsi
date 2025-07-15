import { useMutation } from "@tanstack/react-query";
import { apiClient, wrap } from "../../utils/api";
import type { GuideType } from "../schemas/GuideTypeSchema";

type UpdateGuideInput = {
  id: string;
  title: string;
  type: GuideType;
  content: string;
};

type UpdateGuideResponse = {
  id: string;
  title: string;
  type: GuideType;
  content: string;
  createdAt: string;
  authorId: string;
};

type GuideFormErrors = {
  title?: string;
  type?: string;
  content?: string;
};


export function useUpdateGuide() {
  const mutation = useMutation({
    mutationFn: async ({ id, title, type, content }: UpdateGuideInput) => {
  const result = await wrap<UpdateGuideResponse>(
    apiClient.updateGuide({
      params: { id },
      body: { title, type, content }, 
    })
  );

  if (result.isErr()) {
    throw result.error;
  }

  return result.value;
}

  });

  const formErrors: GuideFormErrors = {};

  return {
    update: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    error: mutation.error,
    errors: formErrors,
  };
}
