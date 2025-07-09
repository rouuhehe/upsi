import { useQuery } from "@tanstack/react-query";
import type { MessageResponseArray } from "../types/MessageResponse";
import { listSessionMessages } from "../services/listSessionMessages";

export function useSessionMessages(id: string | null) {
  const query = useQuery<MessageResponseArray, Error>({
    queryKey: ["sessionMessages", id],
    queryFn: async () => {
      if (!id) return [];

      return (await listSessionMessages(id))._unsafeUnwrap();
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
