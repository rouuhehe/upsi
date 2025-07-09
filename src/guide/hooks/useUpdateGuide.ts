// src/hooks/useUpdateGuide.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiClient } from "../../utils/api";
import type { GuideType } from "../schemas/GuideTypeSchema";
import type { AxiosError } from "axios";

interface UpdateGuideData {
  id: string;
  title: string;
  type: GuideType;
  content: string;
}

interface ValidationErrorResponse {
  errors: {
    title?: string;
  };
}

export function useUpdateGuide() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<{ title?: string }>({});

  const { mutate: update, isPending: isSubmitting } = useMutation({
    mutationFn: (data: UpdateGuideData) =>
      apiClient.updateGuide(
        {
          title: data.title,
          type: data.type,
          content: data.content,
        },
        {
          params: { id: data.id },
        }
      ),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["guide", id] });
      navigate(`/guides/${id}`);
    },
    onError: (error: AxiosError<ValidationErrorResponse>) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error al actualizar guía", error);
      }
    },
  });

  return { update, isSubmitting, errors };
}
