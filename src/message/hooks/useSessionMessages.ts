import { useQuery } from "@tanstack/react-query";
import type { MessageResponseArray } from "../types/MessageResponse";
import { apiClient, wrap } from "../../utils/api";

export function useSessionMessages(id: string | null) {
  const query = useQuery<MessageResponseArray, Error>({
    queryKey: ["sessionMessages", id],
    queryFn: async () => {
      if (!id) return [];

      return (
        await wrap<MessageResponseArray>(
          apiClient.listSessionMessages({ params: { id } }),
        )
      )._unsafeUnwrap();
    },
    enabled: !!id,
  });

  return {
    messages: query.data,
    isError: query.isError,
    error: query.error,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
