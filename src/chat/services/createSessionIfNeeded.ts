import { apiClient, wrap } from "../../utils/api";
import type { SessionResponse } from "../types/SessionResponse";
import { ResultAsync } from "neverthrow";

export function createSessionIfNeeded(
  sessionId: string | null,
  setSessionId: (id: string) => void,
): ResultAsync<string, Error> {
  if (sessionId) {
    return ResultAsync.fromPromise(
      Promise.resolve(sessionId),
      () => new Error("Should never happen"),
    );
  }

  return wrap<SessionResponse>(apiClient.createSession()).map(
    (session: SessionResponse) => {
      setSessionId(session.id);
      return session.id;
    },
  );
}
