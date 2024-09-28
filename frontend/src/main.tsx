import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./route/App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { MobileCamera } from "./route/Camera.tsx";
import { Gallery } from "./route/Gallery.tsx";
import ChildrenLogin from "./route/children-login.tsx";
import { CalendarApp } from "./route/Calendar.tsx";
import { AskAiPage } from "./route/AskAI.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/camera",
    element: <MobileCamera />,
  },
  {
    path: "/gallery",
    element: <Gallery />,
  },
  {
    path: "/children-login",
    element: <ChildrenLogin />,
  },
  {
    path: "calendar",
    element: <CalendarApp />,
  },
  {
    path: "ask-ai",
    element: <AskAiPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
