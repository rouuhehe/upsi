import { ResultAsync } from "neverthrow";
import { apiClient } from "../../utils/api";
import type { ImageResponse } from "../types/ImageResponse";
import axios from "axios";

export function uploadProfileImage(
  file: File
): ResultAsync<ImageResponse, Error> {
  return ResultAsync.fromPromise(
    apiClient.post("/api/users/me/profile-image", { file }),
    (err) => {
      if (axios.isAxiosError(err)) {
        return new Error(err.message);
      }
      return new Error("Error uploading profile image");
    }
  );
}
