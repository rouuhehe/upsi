import { ResultAsync } from "neverthrow";
import type { MessageResponseArray } from "../types/MessageResponse";
import { apiClient } from "../../utils/api";
import axios from "axios";

export function listSessionMessages(
  id: string,
): ResultAsync<MessageResponseArray, Error> {
  return ResultAsync.fromPromise(
    apiClient.listSessionMessages({ params: { id } }),
    (err) => {
      if (axios.isAxiosError(err)) {
        return new Error(err.message);
      }
      return new Error("Failed to list session messages");
    },
  );
}
