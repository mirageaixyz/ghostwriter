import { QueryClientProvider } from "@tanstack/react-query";
import "cal-sans";
import { FC } from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { queryClient, trpc, trpcClient } from "./lib/trpc";
import Nav from "./routes/app/nav";
import Create from "./routes/app/presidents/page";
import Login from "./routes/login/page";
import LandingPage from "./routes/page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/app",
    element: (
      <>
        <Nav />
        <Outlet />
      </>
    ),
    children: [
      {
        path: "/app/presidents",
        element: <Create />,
      },
    ],
  },
]);

const EntryPoint: FC = () => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default EntryPoint;
