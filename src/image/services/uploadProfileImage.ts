import { ResultAsync } from "neverthrow";
import { apiClient } from "../../utils/api";
import type { ImageResponse } from "../types/ImageResponse";
import axios from "axios";

export function uploadProfileImage(
  file: File,
): ResultAsync<ImageResponse, Error> {
  const formData = new FormData();
  formData.append("file", file);

  return ResultAsync.fromPromise(
    apiClient.uploadProfileImage({ file }),
    (err) => {
      if (axios.isAxiosError(err)) {
        return new Error(err.message);
      }
      return new Error("Error uploading profile image");
    },
  );
}
