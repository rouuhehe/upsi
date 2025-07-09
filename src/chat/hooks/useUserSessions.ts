import { useQuery } from "@tanstack/react-query";
import type { SessionResponseArray } from "../types/SessionResponse";
import { listUserSessions } from "../services/listUserSessions";

export function useUserSessions() {
  const query = useQuery<SessionResponseArray, Error>({
    queryKey: ["userSessions"],
    queryFn: async () => {
      return (await listUserSessions())
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
