import { makeApi, Zodios } from "@zodios/core";
import { AuthResponseSchema } from "../auth/schemas/AuthResponseSchema";
import { LoginRequestSchema } from "../auth/schemas/LoginRequestSchema";
import { RegisterRequestSchema } from "../auth/schemas/RegisterRequestSchema";
import { z } from "zod";
import { LawyerRegisterSchema } from "../lawyer/schemas/LawyerRegisterSchema";
import {
  SessionResponseArraySchema,
  SessionResponseSchema,
} from "../chat/schemas/SessionResponseSchema";
import { ImageResponseSchema } from "../image/schemas/ImageResponseSchema";
import { MessageResponseArraySchema } from "../message/schemas/MessageResponseSchema";
import { UserResponseSchema } from "../user/schemas/UserResponseSchema";
import { GuideSchema, GuideListSchema } from "../guide/schemas/GuideSchema";
import { GuideTypeSchema } from "../guide/schemas/GuideTypeSchema";
import {
  LawyerResponseSchema,
  LawyerResponseArraySchema,
} from "../lawyer/schemas/LawyerResponseSchema";
import { LawyerRatingSummarySchema } from "../lawyer/schemas/LawyerRatingSummarySchema";
import { ReviewRequestSchema } from "../lawyer/schemas/ReviewRequestSchema";
import { LawyerReviewArraySchema } from "../lawyer/schemas/LawyerReviewSchema";

const apiEndpoints = makeApi([
  {
    alias: "login",
    method: "post",
    path: "/auth/login",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: LoginRequestSchema,
      },
    ],
    response: AuthResponseSchema,
  },
  {
    alias: "register",
    method: "post",
    path: "/auth/register",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: RegisterRequestSchema,
      },
    ],
    response: AuthResponseSchema,
  },
  {
    alias: "resendVerification",
    method: "get",
    path: "/auth/resend-verification",
    parameters: [
      {
        name: "token",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    alias: "sendLawyerRequest",
    method: "post",
    path: "/auth/lawyer-request",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: LawyerRegisterSchema,
      },
    ],
    response: z.void(),
  },
  {
    alias: "verifyUser",
    method: "get",
    path: "/auth/verify",
    parameters: [
      {
        name: "token",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: AuthResponseSchema,
  },
  {
    alias: "createSession",
    method: "post",
    path: "/api/ai/chat/create",
    response: SessionResponseSchema,
  },
  {
    alias: "deleteSessionById",
    method: "delete",
    path: "/api/ai/chat/sessions/:id",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    alias: "listUserSessions",
    method: "get",
    path: "/api/ai/chat/sessions",
    response: SessionResponseArraySchema,
  },
  {
    alias: "sendPromptBySessionId",
    method: "post",
    path: "/api/ai/chat/message/:id",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "body",
        type: "Body",
        schema: z.string(),
      },
    ],
    requestFormat: "text",
    response: z.string(),
  },
  {
    alias: "deleteProfileImage",
    method: "delete",
    path: "/api/users/me/profile-image",
    response: z.void(),
  },
  {
    alias: "getProfileImage",
    method: "get",
    path: "/api/users/me/profile-image",
    response: ImageResponseSchema,
  },
  {
    alias: "uploadProfileImage",
    method: "post",
    path: "/api/users/me/profile-image",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ file: z.instanceof(File) }),
      },
    ],
    requestFormat: "form-data",
    response: ImageResponseSchema,
  },
  {
    alias: "listSessionMessages",
    method: "get",
    path: "/api/ai/chat/sessions/:id",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: MessageResponseArraySchema,
  },
  {
    alias: "deleteCurrentUser",
    method: "delete",
    path: "/api/users/me",
    response: z.void(),
  },
  {
    alias: "getUserInfo",
    method: "get",
    path: "/api/users/me",
    response: UserResponseSchema,
  },
  {
    alias: "listGuides",
    method: "get",
    path: "/api/guides",
    response: GuideListSchema,
  },
  {
    alias: "getGuideById",
    method: "get",
    path: "/api/guides/:id",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: GuideSchema,
  },
  {
    alias: "createGuide",
    method: "post",
    path: "/api/guides",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({
          title: z.string(),
          type: GuideTypeSchema,
          content: z.string(),
        }),
      },
    ],
    response: GuideSchema,
  },
  {
    alias: "updateGuide",
    method: "put",
    path: "/api/guides/:id",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "body",
        type: "Body",
        schema: z.object({
          title: z.string(),
          type: GuideTypeSchema,
          content: z.string(),
        }),
      },
    ],
    response: GuideSchema,
  },
  {
    alias: "deleteGuide",
    method: "delete",
    path: "/api/guides/:id",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
  },
  {
    alias: "listPublicLawyers",
    method: "get",
    path: "/api/lawyers/public",
    response: LawyerResponseArraySchema,
  },
  {
    alias: "findLawyerMe",
    method: "get",
    path: "/api/lawyers/me",
    response: LawyerResponseSchema,
  },
  {
    alias: "toggleLawyerVisibility",
    method: "patch",
    path: "/api/lawyers/me/visibility",
    parameters: [
      {
        name: "isPublic",
        type: "Query",
        schema: z.boolean(),
      },
    ],
    response: z.void(),
  },
  {
    alias: "sendLawyerContact",
    method: "post",
    path: "/api/contact/lawyers/:lawyerId",
    parameters: [
      { name: "lawyerId", type: "Path", schema: z.string().uuid() },
      {
        name: "body",
        type: "Body",
        schema: z.object({
          subject: z.string(),
          message: z.string(),
        }),
      },
    ],
    response: z.any(),
  },
  {
    alias: "editCurrentUserLawyerDescription",
    method: "patch",
    path: "/api/lawyers/me/desc",
    parameters: [
      {
        name: "newDescription",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: LawyerResponseSchema,
  },
  {
    alias: "getLawyerReviewSummary",
    method: "get",
    path: "/api/reviews/summary/:lawyerId",
    parameters: [
      {
        name: "lawyerId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: LawyerRatingSummarySchema,
  },
  {
    method: "post",
    path: "/api/reviews/:lawyerId/summary",
    parameters: [
      {
        name: "lawyerId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "body",
        type: "Body",
        schema: ReviewRequestSchema,
      },
    ],
    response: z.any(),
  },
  {
    alias: "listLawyerReviews",
    method: "get",
    path: "/api/reviews/:lawyerId/all",
    parameters: [{ name: "lawyerId", type: "Path", schema: z.string().uuid() }],
    response: LawyerReviewArraySchema,
  },
  {
    alias: "getPublicLawyerById",
    method: "get",
    path: "/api/lawyers/public/:id",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: LawyerResponseSchema,
  },
  {
    alias: "createLawyerReview",
    method: "post",
    path: "/api/reviews/:lawyerId",
    parameters: [
      { name: "lawyerId", type: "Path", schema: z.string().uuid() },
      {
        name: "body",
        type: "Body",
        schema: z.object({
          rating: z.number().min(1).max(5),
          content: z.string().min(1),
        }),
      },
    ],
    response: z.void(),
  },
  {
    alias: "hasContactedLawyer",
    method: "get",
    path: "/api/contact/lawyers/:lawyerId/check",
    parameters: [
      {
        name: "lawyerId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.boolean(),
  },
]);

const baseURL = import.meta.env.VITE_API_URL;

export const apiClient = new Zodios(baseURL, apiEndpoints);

apiClient.axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});
