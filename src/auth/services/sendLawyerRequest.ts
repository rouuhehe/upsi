import { ResultAsync } from "neverthrow";
import { apiClient } from "../../utils/api";
import axios from "axios";
import type { LawyerRegister } from "../../lawyer/types/LawyerRegister";

export function sendLawyerRequest(
  lawyerRequest: LawyerRegister,
): ResultAsync<void, Error> {
  return ResultAsync.fromPromise(
    apiClient.sendLawyerRequest(lawyerRequest),
    (err) => {
      if (axios.isAxiosError(err)) {
        return new Error(err.message);
      }
      return new Error("Error sending lawyer registration request");
    },
  );
}
