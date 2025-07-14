import { wrap, apiClient } from "../../utils/api";

export function validateGuideContent(prompt: string) {
  return wrap(apiClient.validateGuideContent({ body: { prompt } }));
}
