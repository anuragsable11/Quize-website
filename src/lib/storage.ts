// All data lives in the browser's localStorage. The key names are unchanged
// from the original static site, so accounts and scores saved there still load.

export type User = {
  name: string
  email: string
  password: string
  profileImage?: string
}

export type ScoreEntry = {
  name: string
  email?: string | null
  /** "correct/total", e.g. "7/10". Older entries only have this field. */
  score: string
  correct?: number
  total?: number
  category?: string
  difficulty?: string
  /** ISO timestamp */
  date?: string
}

const KEYS = {
  users: "users",
  loggedInUser: "loggedInUser",
  loggedInEmail: "loggedInEmail",
  loggedInProfile: "loggedInProfile",
  scores: "scoreList",
} as const

const readJson = <T>(key: string, fallback: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "") ?? fallback
  } catch {
    return fallback
  }
}

// ---------- accounts ----------

export const getUsers = (): User[] => readJson<User[]>(KEYS.users, [])

export const saveUsers = (users: User[]) =>
  localStorage.setItem(KEYS.users, JSON.stringify(users))

// ---------- session ----------

export const setSession = (user: User) => {
  localStorage.setItem(KEYS.loggedInUser, user.name)
  localStorage.setItem(KEYS.loggedInEmail, user.email)
  if (user.profileImage) {
    localStorage.setItem(KEYS.loggedInProfile, user.profileImage)
  } else {
    localStorage.removeItem(KEYS.loggedInProfile)
  }
}

export const clearSession = () => {
  localStorage.removeItem(KEYS.loggedInUser)
  localStorage.removeItem(KEYS.loggedInEmail)
  localStorage.removeItem(KEYS.loggedInProfile)
}

/** The logged-in account, or null for guests. Older sessions only stored the name. */
export const getCurrentUser = (): User | null => {
  const email = localStorage.getItem(KEYS.loggedInEmail)
  const name = localStorage.getItem(KEYS.loggedInUser)
  if (!email && !name) return null
  return getUsers().find((u) => (email ? u.email === email : u.name === name)) ?? null
}

// ---------- scores ----------

export const getScores = (): ScoreEntry[] => readJson<ScoreEntry[]>(KEYS.scores, [])

export const saveScores = (scores: ScoreEntry[]) =>
  localStorage.setItem(KEYS.scores, JSON.stringify(scores))

export const addScore = (entry: ScoreEntry) => saveScores([...getScores(), entry])

/** Scores of the given user, or of guests when null. Entries without an email match by name. */
export const getScoresFor = (user: User | null): ScoreEntry[] => {
  const email = user?.email ?? null
  const name = user?.name ?? "Guest"
  return getScores().filter((s) => (s.email && email ? s.email === email : s.name === name))
}

export class AuthError extends Error {}

export const login = (email: string, password: string): User => {
  const normalized = email.trim().toLowerCase()
  const user = getUsers().find((u) => u.email.toLowerCase() === normalized && u.password === password)
  if (!user) throw new AuthError("Invalid email or password.")
  setSession(user)
  return user
}

export const signup = (name: string, email: string, password: string): User => {
  const normalized = email.trim().toLowerCase()
  if (!name.trim() || !normalized || !password) throw new AuthError("Please fill in all fields.")
  if (password.length < 6) throw new AuthError("Password must be at least 6 characters.")
  const users = getUsers()
  if (users.some((u) => u.email.toLowerCase() === normalized)) {
    throw new AuthError("This email is already registered. Please log in.")
  }
  const user: User = { name: name.trim(), email: normalized, password }
  saveUsers([...users, user])
  setSession(user)
  return user
}

/** Save profile changes. Scores saved under the old name (older entries without an email) move to the new name. */
export const updateUser = (user: User, changes: { name: string; profileImage?: string }): User => {
  const updated: User = { ...user, name: changes.name.trim() }
  if (changes.profileImage) updated.profileImage = changes.profileImage
  else delete updated.profileImage

  const users = getUsers()
  const index = users.findIndex((u) => u.email === user.email)
  if (index === -1) users.push(updated)
  else users[index] = updated
  saveUsers(users)
  setSession(updated)

  if (user.name !== updated.name) {
    saveScores(
      getScores().map((s) =>
        s.name === user.name && (!s.email || s.email === user.email) ? { ...s, name: updated.name } : s
      )
    )
  }
  return updated
}
