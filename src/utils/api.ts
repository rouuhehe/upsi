import z from "zod";
import { initClient, initContract } from "@ts-rest/core";
import {
  SessionResponseArraySchema,
  SessionResponseSchema,
} from "../chat/schemas/SessionResponseSchema";
import {
  LawyerResponseArraySchema,
  LawyerResponseSchema,
} from "../lawyer/schemas/LawyerResponseSchema";
import { AuthResponseSchema } from "../auth/schemas/AuthResponseSchema";
import { LoginRequestSchema } from "../auth/schemas/LoginRequestSchema";
import { RegisterRequestSchema } from "../auth/schemas/RegisterRequestSchema";
import { LawyerRegisterSchema } from "../lawyer/schemas/LawyerRegisterSchema";
import { ImageResponseSchema } from "../image/schemas/ImageResponseSchema";
import { MessageResponseArraySchema } from "../message/schemas/MessageResponseSchema";
import { UserResponseSchema } from "../user/schemas/UserResponseSchema";
import { GuideListSchema, GuideSchema } from "../guide/schemas/GuideSchema";
import { GuideRequestSchema } from "../guide/schemas/GuideRequestSchema";
import { LawyerContactRequestSchema } from "../lawyer/schemas/LawyerContactRequestSchema";
import { LawyerRatingSummarySchema } from "../lawyer/schemas/LawyerRatingSummarySchema";
import { LawyerReviewArraySchema } from "../lawyer/schemas/LawyerReviewSchema";
import { ReviewRequestSchema } from "../lawyer/schemas/ReviewRequestSchema";
import { err, ok, ResultAsync } from "neverthrow";

const ErrorSchema = z
  .object({
    timestamp: z.string().datetime(),
    message: z.string().trim(),
    status: z.number(),
  })
  .strict();

export type APIError = z.infer<typeof ErrorSchema>;

const defaultErrors = {
  400: ErrorSchema,
  401: ErrorSchema,
  403: ErrorSchema,
  404: ErrorSchema,
  409: ErrorSchema,
  500: ErrorSchema,
};

const c = initContract();

const contract = c.router(
  {
    login: {
      method: "POST",
      path: "/auth/login",
      body: LoginRequestSchema,
      responses: {
        200: AuthResponseSchema,
        ...defaultErrors,
      },
      summary: "login user",
    },
    register: {
      method: "POST",
      path: "/auth/register",
      body: RegisterRequestSchema,
      responses: {
        200: AuthResponseSchema,
        ...defaultErrors,
      },
      summary: "register user",
    },
    verifyUser: {
      method: "GET",
      path: "/auth/verify",
      query: z.object({ token: z.string() }),
      responses: {
        200: AuthResponseSchema,
        ...defaultErrors,
      },
    },
    resendVerification: {
      method: "GET",
      path: "/auth/resend-verification",
      query: z.object({ token: z.string() }),
      responses: {
        202: z.void(),
        ...defaultErrors,
      },
    },
    sendLawyerRequest: {
      method: "POST",
      path: "/auth/lawyer-request",
      body: LawyerRegisterSchema,
      responses: {
        202: z.void(),
        ...defaultErrors,
      },
    },
    createSession: {
      method: "POST",
      path: "/api/ai/chat/create",
      body: z.undefined(),
      responses: {
        200: SessionResponseSchema,
        ...defaultErrors,
      },
    },
    deleteSessionById: {
      method: "DELETE",
      path: "/api/ai/chat/session/:id",
      responses: {
        204: z.void(),
        ...defaultErrors,
      },
    },
    listUserSessions: {
      method: "GET",
      path: "/api/ai/chat/sessions",
      responses: {
        200: SessionResponseArraySchema,
        ...defaultErrors,
      },
    },
    sendPromptBySessionId: {
      method: "POST",
      path: "/api/ai/chat/message/:id",
      body: z.object({ prompt: z.string() }),
      responses: {
        200: z.string(),
        ...defaultErrors,
      },
    },
    getProfileImage: {
      method: "GET",
      path: "/api/users/me/profile-image",
      responses: {
        200: ImageResponseSchema,
        ...defaultErrors,
      },
    },
    uploadProfileImage: {
      method: "POST",
      path: "/api/users/me/profile-image",
      body: z.unknown(),
      contentType: "multipart/form-data",
      responses: {
        200: ImageResponseSchema,
        ...defaultErrors,
      },
    },
    deleteProfileImage: {
      method: "DELETE",
      path: "/api/users/me/profile-image",
      responses: {
        204: z.void(),
        ...defaultErrors,
      },
    },
    listSessionMessages: {
      method: "GET",
      path: "/api/ai/chat/sessions/:id",
      responses: {
        200: MessageResponseArraySchema,
        ...defaultErrors,
      },
    },
    getGuideById: {
      method: "GET",
      path: "/api/guides/:id",
      responses: {
        200: GuideSchema,
        ...defaultErrors,
      },
    },
    listGuides: {
      method: "GET",
      path: "/api/guides",
      responses: {
        200: GuideListSchema,
        ...defaultErrors,
      },
    },
    createGuide: {
      method: "POST",
      path: "/api/guides",
      body: GuideRequestSchema,
      responses: {
        200: GuideSchema,
        ...defaultErrors,
      },
    },
    updateGuide: {
      method: "PUT",
      path: "/api/guides/:id",
      body: GuideRequestSchema,
      responses: {
        200: GuideSchema,
        ...defaultErrors,
      },
    },
    deleteGuide: {
      method: "DELETE",
      path: "/api/guides/:id",
      responses: {
        204: z.void(),
        ...defaultErrors,
      },
    },
    listPublicLawyers: {
      method: "GET",
      path: "/api/lawyers/public",
      responses: {
        200: LawyerResponseArraySchema,
        ...defaultErrors,
      },
    },
    findLawyerMe: {
      method: "GET",
      path: "/api/lawyers/me",
      responses: {
        200: LawyerResponseSchema,
        ...defaultErrors,
      },
    },
    toggleLawyerVisibility: {
      method: "PATCH",
      path: "/api/lawyers/me/visibility",
      query: z.object({ isPublic: z.boolean() }),
      body: z.undefined(),
      responses: {
        204: z.void(),
        ...defaultErrors,
      },
    },
    sendLawyerContact: {
      method: "POST",
      path: "/api/contact/lawyers/:lawyerId",
      body: LawyerContactRequestSchema,
      responses: {
        200: z.void(),
        ...defaultErrors,
      },
    },
    editCurrentUserLawyerDescription: {
      method: "PATCH",
      path: "/api/lawyers/me/desc",
      query: z.object({ newDescription: z.string() }),
      body: z.undefined(),
      responses: {
        200: LawyerResponseSchema,
        ...defaultErrors,
      },
    },
    getLawyerReviewSummary: {
      method: "GET",
      path: "/api/reviews/summary/:lawyerId",
      responses: {
        200: LawyerRatingSummarySchema,
        ...defaultErrors,
      },
    },
    listLawyerReviews: {
      method: "GET",
      path: "/api/reviews/:lawyerId/all",
      responses: {
        200: LawyerReviewArraySchema,
        ...defaultErrors,
      },
    },
    getPublicLawyerById: {
      method: "GET",
      path: "/api/lawyers/public/:id",
      responses: {
        200: LawyerResponseSchema,
        ...defaultErrors,
      },
    },
    createLawyerReview: {
      method: "POST",
      path: "/api/reviews/:lawyerId",
      body: ReviewRequestSchema,
      responses: {
        200: z.void(),
        ...defaultErrors,
      },
    },
    hasContactedLawyer: {
      method: "GET",
      path: "/api/contact/lawyers/:lawyerId/check",
      responses: {
        200: z.boolean(),
        ...defaultErrors,
      },
    },
    getUserInfo: {
      method: "GET",
      path: "/api/users/me",
      responses: {
        200: UserResponseSchema,
        ...defaultErrors,
      },
    },
    deleteCurrentUser: {
      method: "DELETE",
      path: "/api/users/me",
      responses: {
        204: z.void(),
        ...defaultErrors,
      },
    },
  },
  { strictStatusCodes: true },
);

const baseUrl = import.meta.env.VITE_API_URL;

const getToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return token;
  }
  return "";
};

export const apiClient = initClient(contract, {
  baseUrl,
  baseHeaders: {
    Authorization: () => `Bearer ${getToken()}`,
  },
  validateResponse: true,
  throwOnUnknownStatus: true,
});

export function wrap<T>(
  promise: Promise<{ status: number; body: T | APIError }>,
  mapErr?: (err: APIError, status: number) => string,
): ResultAsync<T, Error> {
  return ResultAsync.fromPromise(promise, (err) => {
    console.error(err);
    return new Error("Error inesperado, conexión falló");
  }).andThen((res) => {
    if (res.status >= 200 && res.status < 400) {
      return ok(res.body as T);
    }
    const apiError = res.body as APIError;
    const mapped = mapErr?.(apiError, res.status) ?? apiError.message;

    return err(new Error(mapped || "Error desconocido"));
  });
}
