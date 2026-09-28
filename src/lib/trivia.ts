// Client for the Open Trivia Database (https://opentdb.com/).

export const CATEGORIES = [
  { id: "", name: "Any category" },
  { id: "9", name: "General Knowledge" },
  { id: "10", name: "Books" },
  { id: "11", name: "Film" },
  { id: "12", name: "Music" },
  { id: "14", name: "Television" },
  { id: "15", name: "Video Games" },
  { id: "16", name: "Board Games" },
  { id: "17", name: "Science & Nature" },
  { id: "18", name: "Computers" },
  { id: "19", name: "Mathematics" },
  { id: "20", name: "Mythology" },
  { id: "21", name: "Sports" },
  { id: "22", name: "Geography" },
  { id: "23", name: "History" },
  { id: "24", name: "Politics" },
  { id: "25", name: "Art" },
  { id: "28", name: "Vehicles" },
] as const

export const DIFFICULTIES = [
  { id: "", name: "Any difficulty" },
  { id: "easy", name: "Easy" },
  { id: "medium", name: "Medium" },
  { id: "hard", name: "Hard" },
] as const

export const QUESTION_COUNTS = [5, 10, 15, 20, 30, 40, 50] as const
export const TIME_LIMITS = [10, 15, 20, 25, 30, 60] as const

export type QuizSettings = {
  amount: number
  category: string
  difficulty: string
  seconds: number
}

export type Question = {
  question: string
  category: string
  difficulty: string
  correct: string
  answers: string[]
}

/** An error whose message is safe to show to the player. */
export class QuizError extends Error {}

// The API returns HTML-encoded text (e.g. &quot; and &#039;).
const decodeHtml = (html: string) =>
  new DOMParser().parseFromString(html, "text/html").documentElement.textContent ?? html

// Fisher-Yates shuffle
const shuffle = <T>(items: T[]): T[] => {
  const array = [...items]
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

type ApiQuestion = {
  category: string
  difficulty: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

export async function fetchQuestions(settings: QuizSettings): Promise<Question[]> {
  const params = new URLSearchParams({ amount: String(settings.amount), type: "multiple" })
  if (settings.category) params.set("category", settings.category)
  if (settings.difficulty) params.set("difficulty", settings.difficulty)

  let data: { response_code: number; results: ApiQuestion[] }
  try {
    const res = await fetch(`https://opentdb.com/api.php?${params}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    data = await res.json()
  } catch {
    throw new QuizError("Couldn't load questions. Check your internet connection and try again.")
  }

  // response_code 5 = rate limited (one request per 5 seconds per IP),
  // 1 = not enough questions for the requested filters.
  if (data.response_code === 5) {
    throw new QuizError("Too many requests. Please wait a few seconds and try again.")
  }
  if (data.response_code !== 0 || !data.results?.length) {
    throw new QuizError("There aren't enough questions for this selection. Try fewer questions or a different category or difficulty.")
  }

  return data.results.map((q) => ({
    question: decodeHtml(q.question),
    category: decodeHtml(q.category),
    difficulty: q.difficulty,
    correct: decodeHtml(q.correct_answer),
    answers: shuffle([q.correct_answer, ...q.incorrect_answers].map(decodeHtml)),
  }))
}

export const categoryName = (id: string) => CATEGORIES.find((c) => c.id === id)?.name ?? "Any category"
