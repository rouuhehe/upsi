// src/hooks/useCreateGuide.ts
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { submitGuide } from "../services/submitGuide";
import { toast } from "react-hot-toast";

export function useCreateGuide() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const create = async ({
    title,
    type,
    content,
  }: {
    title: string;
    type: string;
    content: string;
  }) => {
    setIsSubmitting(true);
    setErrors({});

    const result = await submitGuide({ title, type, content });

    result.match(
      (guide) => {
        toast.success("Guía creada correctamente");
        navigate(`/guides/${guide.id}`);
      },
      (error) => {
        if (error instanceof Error && "issues" in error) {
          const zodErrors = error.issues;
          const fieldErrors: Record<string, string> = {};
          zodErrors.forEach((e) => {
            if (e.path[0]) fieldErrors[e.path[0]] = e.message;
          });
          setErrors(fieldErrors);
        } else {
          toast.error("Error al crear la guía");
          console.error(error);
        }
      },
    );

    setIsSubmitting(false);
  };

  return { create, isSubmitting, errors };
}
