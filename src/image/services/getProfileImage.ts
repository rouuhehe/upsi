import { ResultAsync } from "neverthrow";
import { apiClient } from "../../utils/api";
import type { ImageResponse } from "../types/ImageResponse";
import axios from "axios";

export function getProfileImage(): ResultAsync<ImageResponse, Error> {
  return ResultAsync.fromPromise(apiClient.getProfileImage(), (err) => {
    if (axios.isAxiosError(err)) {
      return new Error(err.message);
    }
    return new Error("Error requesting profile image");
  });
}
