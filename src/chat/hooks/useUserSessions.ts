import { useQuery } from "@tanstack/react-query";
import type { SessionResponseArray } from "../types/SessionResponse";
import { apiClient, wrap } from "../../utils/api";

export function useUserSessions() {
  const query = useQuery<SessionResponseArray, Error>({
    queryKey: ["userSessions"],
    queryFn: async () => {
      return (await wrap<SessionResponseArray>(apiClient.listUserSessions()))
        .map((sessions) =>
          sessions.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        )
        ._unsafeUnwrap();
    },
  });

  return {
    sessions: query.data,
    isError: query.isError,
    error: query.error,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
