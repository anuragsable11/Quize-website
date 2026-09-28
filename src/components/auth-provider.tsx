import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { AuthContext, type AuthContextValue } from "@/lib/auth"
import * as store from "@/lib/storage"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<store.User | null>(() => store.getCurrentUser())

  // Keep tabs in sync when the user logs in or out in another tab
  useEffect(() => {
    const onStorage = () => setUser(store.getCurrentUser())
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const login = useCallback((email: string, password: string) => {
    const u = store.login(email, password)
    setUser(u)
    return u
  }, [])

  const signup = useCallback((name: string, email: string, password: string) => {
    const u = store.signup(name, email, password)
    setUser(u)
    return u
  }, [])

  const logout = useCallback(() => {
    store.clearSession()
    setUser(null)
  }, [])

  const updateProfile = useCallback(
    (changes: { name: string; profileImage?: string }) => {
      if (!user) throw new store.AuthError("You need to be logged in to edit your profile.")
      const u = store.updateUser(user, changes)
      setUser(u)
      return u
    },
    [user]
  )

  const value = useMemo<AuthContextValue>(
    () => ({ user, login, signup, logout, updateProfile }),
    [user, login, signup, logout, updateProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
