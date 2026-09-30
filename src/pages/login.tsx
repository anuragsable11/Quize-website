import { useState, type FormEvent } from "react"
import { Link, Navigate, useNavigate, useSearchParams } from "react-router"
import { AlertCircleIcon } from "lucide-react"
import { toast } from "sonner"
import { AuthCard } from "@/components/auth-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { useAuth } from "@/lib/auth"
import { AuthError } from "@/lib/storage"

/** Only follow same-site paths after login, never external URLs. */
const safeNext = (next: string | null) => (next && next.startsWith("/") && !next.startsWith("//") ? next : "/quiz")

export default function LoginPage() {
  useDocumentTitle("Log in")
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [alreadyLoggedIn] = useState(() => user !== null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  if (alreadyLoggedIn) return <Navigate to="/scorecard" replace />

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const u = login(email, password)
      toast.success(`Welcome back, ${u.name}.`)
      navigate(safeNext(params.get("next")), { replace: true })
    } catch (err) {
      setError(err instanceof AuthError ? err.message : "Something went wrong. Please try again.")
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      description="Log in to keep your scores on your account."
      footer={
        <>
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>
          <p>
            <Link to="/quiz" className="underline-offset-4 hover:text-foreground hover:underline">
              Continue as a guest
            </Link>
          </p>
        </>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl px-3.5"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl px-3.5"
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="h-11 w-full rounded-xl text-[0.95rem]">
          Log in
        </Button>
      </form>
    </AuthCard>
  )
}
