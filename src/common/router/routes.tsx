import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import App from "../../App";
import HomePage from "../pages/Welcome";
import LoginPage from "../../auth/pages/LoginPage";
import RegisterPage from "../../auth/pages/RegisterPage";
import ChatPage from "../../chat/pages/ChatPage";
import { PublicRoute } from "./PublicRoute";
import NotFoundPage from "../pages/NotFoundPage";
import DashboardPage from "../../user/pages/DashboardPage";
import VerificationPage from "../../auth/pages/VerificationPage";
import { GuidePage } from "../../guide/pages/GuidePage";
import CreateGuidePage from "../../guide/pages/CreateGuidePage";
import GuideDetailsPage from "../../guide/pages/GuideDetailPage";
import EditGuidePage from "../../guide/pages/EditGuidePage";
import { LawyerPage } from "../../lawyer/pages/LawyerPage";
import AuthHomePage from "../pages/AuthHomePage";
import { RegisterSuccess } from "../../auth/pages/RegisterSuccess";
import LawyerProfilePage from "../../lawyer/pages/LawyerProfilePage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" />,
      },

      {
        path: "home",
        element: <AuthHomePage />,
      },

      {
        element: <PublicRoute />,
        children: [
          {
            path: "auth",
            children: [
              {
                path: "login",
                element: <LoginPage />,
              },
              {
                path: "register",
                element: <RegisterPage />,
              },
              {
                path: "verify/:token",
                element: <VerificationPage />,
              },
              {
                path: "register-success",
                element: <RegisterSuccess />,
              },
            ],
          },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "welcome",
            element: <HomePage />,
          },
          {
            path: "profile",
            element: <DashboardPage />,
          },
          {
            path: "lawyers",
            element: <LawyerPage />,
          },
          {
            path: "lawyers/:lawyerId",
            element: <LawyerProfilePage />,
          },
          {
            path: "chat/:id?",
            element: <ChatPage />,
          },
          {
            path: "guides",
            element: <GuidePage />,
          },
          {
            path: "guides/new",
            element: <CreateGuidePage />,
          },
          {
            path: "guides/:id",
            element: <GuideDetailsPage />,
          },
          {
            path: "guides/edit/:id",
            element: <EditGuidePage />,
          },
        ],
      },

      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
