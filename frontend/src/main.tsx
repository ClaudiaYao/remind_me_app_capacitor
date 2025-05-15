// import { StrictMode } from "react";

// import ReactDOM from "react-dom/client";
// import { RouterProvider } from "react-router-dom";
// import { router } from "../routes"; // Your router definition

// import "@/assets/styles/index.css";
// import App from "@/App.tsx";

// // Claudia: entry point for the whole front end app
// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// );

// main.tsx or App.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes"; // Your router definition
import "@/assets/styles/index.css";
import "@/assets/styles/App.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
