import { ResultAsync } from "neverthrow";
import { apiClient, wrap } from "../../utils/api";
import type { ImageResponse } from "../types/ImageResponse";

export function uploadProfileImage(
    file: File,
): ResultAsync<ImageResponse, Error> {
  const formData = new FormData();
  formData.append("file", file);

  return wrap<ImageResponse>(apiClient.uploadProfileImage({ body: formData }));
}