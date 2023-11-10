import { QueryClientProvider } from "@tanstack/react-query";
import "cal-sans";
import { FC } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { MeProvider } from "./lib/context/me";
import { queryClient, trpc, trpcClient } from "./lib/trpc";
import LandingPage from "./routes/page";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MeProvider>
        <Toaster />
        <Outlet />
      </MeProvider>
    ),
    children: [
      {
        path: "/",
        element: <LandingPage />,
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
