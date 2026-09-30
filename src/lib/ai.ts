// Client for the AI features. The functions in api/ call Hugging Face with the site's token,
// which never reaches the browser.

import { QuizError, shuffle, type Question, type QuizSettings } from "@/lib/trivia"

/**
 * The AI features are for subscribers. There are no subscriptions yet, so while this is on,
 * both features are shown with a lock and open a "subscribe" dialog instead of calling the AI.
 */
export const AI_LOCKED: boolean = true

/** Longer AI quizzes take too long to write. */
export const AI_QUESTION_COUNTS = [5, 10, 15, 20] as const

type GeneratedQuestion = {
  question: string
  correct: string
  incorrect: string[]
  difficulty: string
}

async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch {
    throw new QuizError("Couldn't reach the AI. Check your internet connection and try again.")
  }
  // Where the api/ functions don't run (e.g. `vite preview`), the app's HTML comes back instead of JSON
  const data = await res.json().catch(() => null)
  if (!res.ok || !data) {
    throw new QuizError(data?.error ?? "AI features aren't available right now. Please try again later.")
  }
  return data as T
}

export async function generateQuestions(settings: QuizSettings): Promise<Question[]> {
  const topic = settings.topic.trim()
  if (!topic) throw new QuizError("Enter a topic for the AI to write questions about.")

  const { questions } = await post<{ questions: GeneratedQuestion[] }>("/api/generate", {
    topic,
    amount: settings.amount,
    difficulty: settings.difficulty,
  })
  return questions.map((q) => ({
    question: q.question,
    category: topic,
    difficulty: q.difficulty,
    correct: q.correct,
    answers: shuffle([q.correct, ...q.incorrect]),
    ai: true,
  }))
}

/** Why the correct answer is right. `answer` is the player's answer, or null if time ran out. */
export async function explainAnswer(question: Question, answer: string | null): Promise<string> {
  const { explanation } = await post<{ explanation: string }>("/api/explain", {
    question: question.question,
    correct: question.correct,
    answer,
  })
  return explanation
}
