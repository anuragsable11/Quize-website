import { useCallback, useEffect, useReducer, useState } from "react"
import { useSearchParams } from "react-router"
import { PageHeader } from "@/components/page-header"
import { QuizQuestion } from "@/components/quiz/quiz-question"
import { QuizResults } from "@/components/quiz/quiz-results"
import { QuizSetup } from "@/components/quiz/quiz-setup"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { generateQuestions } from "@/lib/ai"
import { useAuth } from "@/lib/auth"
import { tick } from "@/lib/media"
import { addScore } from "@/lib/storage"
import { CATEGORIES, categoryName, fetchQuestions, QuizError, type Question, type QuizSettings } from "@/lib/trivia"

// ---------- state ----------

type State =
  | { phase: "setup" }
  | {
      phase: "playing"
      questions: Question[]
      index: number
      seconds: number
      remaining: number
      selected: string | null
      checked: boolean
      /** One entry per answered question; null = time ran out */
      answers: (string | null)[]
    }
  | { phase: "finished"; questions: Question[]; answers: (string | null)[] }

type Action =
  | { type: "start"; questions: Question[]; seconds: number }
  | { type: "select"; answer: string }
  | { type: "submit" }
  | { type: "tick" }
  | { type: "next" }
  | { type: "reset" }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return {
        phase: "playing",
        questions: action.questions,
        index: 0,
        seconds: action.seconds,
        remaining: action.seconds,
        selected: null,
        checked: false,
        answers: [],
      }
    case "reset":
      return { phase: "setup" }
  }

  if (state.phase !== "playing") return state

  switch (action.type) {
    case "select":
      return state.checked ? state : { ...state, selected: action.answer }
    case "submit":
      if (state.checked || !state.selected) return state
      return { ...state, checked: true, answers: [...state.answers, state.selected] }
    case "tick": {
      if (state.checked) return state
      const remaining = state.remaining - 1
      // Time's up: an answer that was selected but not submitted still counts
      if (remaining <= 0) return { ...state, remaining: 0, checked: true, answers: [...state.answers, state.selected] }
      return { ...state, remaining }
    }
    case "next": {
      if (!state.checked) return state
      const index = state.index + 1
      if (index >= state.questions.length) return { phase: "finished", questions: state.questions, answers: state.answers }
      return { ...state, index, remaining: state.seconds, selected: null, checked: false }
    }
  }
  return state
}

const DEFAULT_SETTINGS: QuizSettings = { source: "trivia", amount: 10, category: "", topic: "", difficulty: "", seconds: 30 }

// ---------- page ----------

export default function QuizPage() {
  const { user } = useAuth()
  // Links such as /quiz?category=17 (from the home page) preselect a category
  const [params] = useSearchParams()
  const [settings, setSettings] = useState<QuizSettings>(() => {
    const category = params.get("category") ?? ""
    return CATEGORIES.some((c) => c.id === category) ? { ...DEFAULT_SETTINGS, category } : DEFAULT_SETTINGS
  })
  const [state, dispatch] = useReducer(reducer, { phase: "setup" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useDocumentTitle(state.phase === "finished" ? "Results" : "Play")

  const start = async () => {
    setError(null)
    setLoading(true)
    try {
      const questions = settings.source === "ai" ? await generateQuestions(settings) : await fetchQuestions(settings)
      dispatch({ type: "start", questions, seconds: settings.seconds })
      window.scrollTo({ top: 0 })
    } catch (err) {
      setError(err instanceof QuizError ? err.message : "Something went wrong. Please try again.")
      dispatch({ type: "reset" })
    } finally {
      setLoading(false)
    }
  }

  // Countdown, one tick per second while a question is open
  const openQuestion = state.phase === "playing" && !state.checked ? state.index : -1
  useEffect(() => {
    if (openQuestion < 0) return
    const id = window.setInterval(() => dispatch({ type: "tick" }), 1000)
    return () => window.clearInterval(id)
  }, [openQuestion])

  // Quiet tick during the last three seconds
  const secondsLeft = state.phase === "playing" && !state.checked ? state.remaining : null
  useEffect(() => {
    if (secondsLeft !== null && secondsLeft > 0 && secondsLeft <= 3) tick()
  }, [secondsLeft])

  const next = useCallback(() => {
    if (state.phase !== "playing" || !state.checked) return
    // Save the result as the last question closes
    if (state.index === state.questions.length - 1) {
      const correct = state.questions.filter((q, i) => state.answers[i] === q.correct).length
      const total = state.questions.length
      addScore({
        name: user?.name ?? "Guest",
        email: user?.email ?? null,
        score: `${correct}/${total}`,
        correct,
        total,
        category: settings.source === "ai" ? `${settings.topic.trim()} (AI)` : categoryName(settings.category),
        difficulty: settings.difficulty || "any",
        date: new Date().toISOString(),
      })
    }
    dispatch({ type: "next" })
  }, [state, user, settings])

  // Keyboard: 1–4 or A–D choose an answer, Enter submits / continues
  useEffect(() => {
    if (state.phase !== "playing") return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement
      if (target.closest("input, textarea, select, [role=dialog], [role=menu]")) return

      const key = e.key.toLowerCase()
      const n = "1234".indexOf(key) >= 0 ? "1234".indexOf(key) : "abcd".indexOf(key)
      if (n >= 0 && !state.checked && state.questions[state.index].answers[n]) {
        dispatch({ type: "select", answer: state.questions[state.index].answers[n] })
      } else if (key === "enter") {
        // Let Enter on Submit/Next/Quit do its own click; on an answer it submits
        if (target.closest("button") && !target.closest("[data-testid=answer]")) return
        e.preventDefault()
        if (state.checked) next()
        else dispatch({ type: "submit" })
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [state, next])

  const greeting = user
    ? `Signed in as ${user.name}. Results are saved to your scorecard.`
    : "Playing as a guest. Log in to keep scores under your name."

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <div
        aria-hidden
        className="absolute inset-x-0 -top-16 -z-10 h-96 bg-[radial-gradient(50%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent)]"
      />
      {state.phase === "setup" && (
        <>
          <PageHeader
            eyebrow="Play"
            title="Set up your quiz"
            description="Choose your settings, then answer each question before the timer runs out."
            className="mb-8"
          />
          <QuizSetup
            settings={settings}
            onChange={setSettings}
            onStart={start}
            loading={loading}
            error={error}
            greeting={greeting}
          />
        </>
      )}

      {state.phase === "playing" && (
        <QuizQuestion
          question={state.questions[state.index]}
          index={state.index}
          total={state.questions.length}
          score={state.questions.filter((q, i) => state.answers[i] === q.correct).length}
          history={state.answers.map((a, i) => a === state.questions[i].correct)}
          seconds={state.seconds}
          remaining={state.remaining}
          selected={state.selected}
          checked={state.checked}
          isLast={state.index === state.questions.length - 1}
          onSelect={(answer) => dispatch({ type: "select", answer })}
          onSubmit={() => dispatch({ type: "submit" })}
          onNext={next}
          onQuit={() => dispatch({ type: "reset" })}
        />
      )}

      {state.phase === "finished" && (
        <QuizResults
          questions={state.questions}
          answers={state.answers}
          loading={loading}
          onPlayAgain={start}
          onChangeSettings={() => {
            setError(null)
            dispatch({ type: "reset" })
          }}
        />
      )}
    </div>
  )
}
