// routes.tsx
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/layout/RootLayout";
import { Home, About, Identify, Upload } from "@/pages";
import TrainModel from "./pages/train";
import SignUpComponent from "@/components/SignUp";
import VerifyEmail from "@/components/VerifyEmail";
import PasswordResetComponent from "@/components/PasswordReset";
import Login from "@/components/Login";
import MyProfile from "@/components/MyProfile";
import RemindeeDetails from "@/pages/RemindeeDetails";
import Instruction from "./pages/Instruction";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Includes Navbar + wrapper
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "identify", element: <Identify /> },
      { path: "upload", element: <Upload /> },
      { path: "train", element: <TrainModel /> },
      { path: "register", element: <SignUpComponent /> },
      { path: "verify-email", element: <VerifyEmail /> },
      { path: "reset-password", element: <PasswordResetComponent /> },
      { path: "login", element: <Login /> },
      { path: "profile", element: <MyProfile /> },
      { path: "remindee-details", element: <RemindeeDetails /> },
      { path: "instruction", element: <Instruction /> },
    ],
  },
]);
