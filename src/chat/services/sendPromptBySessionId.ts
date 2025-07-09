import { ResultAsync } from "neverthrow";
import { apiClient } from "../../utils/api";
import axios from "axios";

export function sendPromptBySessionId(
  id: string,
  prompt: string,
): ResultAsync<string, Error> {
  return ResultAsync.fromPromise(
    apiClient.sendPromptBySessionId(prompt, { params: { id } }),
    (err) => {
      if (axios.isAxiosError(err)) {
        return new Error(err.message);
      }
      return new Error("Error sending prompt");
    },
  );
}
