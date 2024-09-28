import { createRoot } from "react-dom/client";
import App from "./route/App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { MobileCamera } from "./route/Camera.tsx";
import { Gallery } from "./route/Gallery.tsx";
import ChildrenLogin from "./route/children-login.tsx";
import { CalendarApp } from "./route/Calendar.tsx";
import { AskAiPage } from "./route/AskAI.tsx";
import { PhonePage } from "./route/Phone.tsx";
import { MessageAppPage } from "./route/Message.tsx";
import NewsPage from "./route/News.tsx";
import WeatherApp from "./route/Weather.tsx";
import Dashboard from "./route/Dashboard.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import CreateChildren from "./route/create-children.tsx";
import { HomeWorkAI } from "./route/HomeWorkAI.tsx";

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
  {
    path: "phone",
    element: <PhonePage />,
  },
  {
    path: "message",
    element: <MessageAppPage />,
  },
  {
    path: "news",
    element: <NewsPage />,
  },
  {
    path: "weather",
    element: <WeatherApp />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/create-children",
    element: <CreateChildren />,
  },
  {
    path: "/homework-ai",
    element: <HomeWorkAI />,
  },
]);

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: `${window.location.origin}/dashboard`,
    }}
  >
    <RouterProvider router={router} />
  </Auth0Provider>
  // </StrictMode>
);
