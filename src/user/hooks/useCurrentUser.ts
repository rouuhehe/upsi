import type { UserResponse } from "../types/UserResponse";
import { getUserInfo } from "../services/getUserInfo";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../auth/hooks/useAuthContext";

export function useCurrentUser() {
  const { session } = useAuthContext();

  const query = useQuery<UserResponse, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      return (await getUserInfo())._unsafeUnwrap();
    },
    enabled: !!session,
  });

  return {
    user: query.data,
    isError: query.isError,
    error: query.error,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
