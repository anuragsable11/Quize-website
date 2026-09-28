import { lazy, Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router"
import { RootLayout } from "@/components/layout/root-layout"
import HomePage from "@/pages/home"
import LoginPage from "@/pages/login"
import NotFoundPage from "@/pages/not-found"
import ProfilePage from "@/pages/profile"
import QuizPage from "@/pages/quiz"
import SignupPage from "@/pages/signup"

// The scorecard pulls in the charting library, so it loads on demand
const ScorecardPage = lazy(() => import("@/pages/scorecard"))

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "quiz", element: <QuizPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      {
        path: "scorecard",
        element: (
          <Suspense fallback={<div className="min-h-[60svh]" />}>
            <ScorecardPage />
          </Suspense>
        ),
      },
      { path: "profile", element: <ProfilePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
