import { createContext, useContext } from "react"
import type { User } from "@/lib/storage"

export type AuthContextValue = {
  /** The logged-in account, or null when playing as a guest. */
  user: User | null
  login: (email: string, password: string) => User
  signup: (name: string, email: string, password: string) => User
  logout: () => void
  updateProfile: (changes: { name: string; profileImage?: string }) => User
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within <AuthProvider>")
  return context
}

/** Initials for avatar fallbacks, e.g. "Ada Lovelace" -> "AL". */
export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?"
