import { useState, type FormEvent } from "react"
import { Link, Navigate, useNavigate } from "react-router"
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

export default function SignupPage() {
  useDocumentTitle("Sign up")
  const { user, signup } = useAuth()
  const navigate = useNavigate()
  const [alreadyLoggedIn] = useState(() => user !== null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  if (alreadyLoggedIn) return <Navigate to="/scorecard" replace />

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      signup(name, email, password)
      toast.success("Your account is ready.")
      navigate("/quiz", { replace: true })
    } catch (err) {
      setError(err instanceof AuthError ? err.message : "Something went wrong. Please try again.")
    }
  }

  return (
    <AuthCard
      title="Create your account"
      description="Save your scores and track your progress."
      footer={
        <p>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl px-3.5" />
        </div>
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
            autoComplete="new-password"
            minLength={6}
            required
            aria-describedby="password-hint"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl px-3.5"
          />
          <p id="password-hint" className="text-xs text-muted-foreground">
            At least 6 characters.
          </p>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="h-11 w-full rounded-xl text-[0.95rem]">
          Create account
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Accounts are stored in this browser only. Don't reuse a password you use elsewhere.
        </p>
      </form>
    </AuthCard>
  )
}
