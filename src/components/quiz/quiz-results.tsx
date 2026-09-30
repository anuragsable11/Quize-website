import { useEffect, useState } from "react"
import { Link } from "react-router"
import { CheckIcon, Loader2Icon, LockIcon, RotateCcwIcon, SlidersHorizontalIcon, SparklesIcon, TimerOffIcon, XIcon } from "lucide-react"
import { ProgressRing } from "@/components/progress-ring"
import { SubscribeDialog } from "@/components/subscribe-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AI_LOCKED, explainAnswer } from "@/lib/ai"
import { QuizError, type Question } from "@/lib/trivia"
import { cn } from "@/lib/utils"

type Props = {
  questions: Question[]
  /** The answer given for each question; null when time ran out. */
  answers: (string | null)[]
  loading: boolean
  onPlayAgain: () => void
  onChangeSettings: () => void
}

export function QuizResults({ questions, answers, loading, onPlayAgain, onChangeSettings }: Props) {
  const total = questions.length
  const correct = questions.filter((q, i) => answers[i] === q.correct).length
  const timedOut = answers.filter((a) => a === null).length
  const incorrect = total - correct - timedOut
  const percent = Math.round((correct / total) * 100)
  const [subscribeOpen, setSubscribeOpen] = useState(false)

  // The ring fills up from empty once the results appear
  const [ring, setRing] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setRing(percent / 100))
    return () => cancelAnimationFrame(id)
  }, [percent])

  const verdict =
    percent >= 80
      ? { title: "Excellent result", text: "You clearly know this topic well." }
      : percent >= 50
        ? { title: "Good effort", text: "A solid score. Review the questions you missed below." }
        : { title: "Keep practising", text: "Review the answers below and try again." }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <Card className="gap-0 py-0 shadow-elevated" data-testid="results">
        <div className="relative isolate px-6 pt-10 pb-8 text-center sm:pt-12">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(50%_70%_at_50%_0%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]"
          />
          <p className="font-mono text-[0.7rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">Your score</p>
          <ProgressRing
            value={ring}
            size={168}
            strokeWidth={10}
            className="mt-5"
            indicatorClassName={cn("duration-[1400ms] ease-out", percent >= 80 ? "text-success" : percent >= 50 ? "text-primary" : "text-warning")}
          >
            <div>
              <p className="text-5xl font-semibold tracking-tight tabular-nums" data-testid="final-score">
                {correct}
                <span className="text-3xl text-muted-foreground">/{total}</span>
              </p>
              <p className="mt-1 font-mono text-sm text-muted-foreground tabular-nums">{percent}%</p>
            </div>
          </ProgressRing>
          <h2 className="mt-6 text-2xl font-semibold tracking-tight" data-testid="verdict">
            {verdict.title}
          </h2>
          <p className="mt-1.5 text-muted-foreground">{verdict.text}</p>
        </div>

        <dl className="grid grid-cols-3 divide-x border-y text-center">
          <Stat label="Correct" value={correct} className="text-success" />
          <Stat label="Incorrect" value={incorrect} className="text-destructive" />
          <Stat label="Timed out" value={timedOut} className="text-muted-foreground" />
        </dl>

        <div className="flex flex-col gap-2 p-5 sm:flex-row sm:justify-center">
          <Button onClick={onPlayAgain} disabled={loading} className="h-10 rounded-xl px-5" data-testid="play-again">
            <RotateCcwIcon data-icon="inline-start" /> {loading ? "Loading…" : "Play again"}
          </Button>
          <Button variant="outline" onClick={onChangeSettings} className="h-10 rounded-xl px-5">
            <SlidersHorizontalIcon data-icon="inline-start" /> Change settings
          </Button>
          <Button variant="ghost" asChild className="h-10 rounded-xl px-5">
            <Link to="/scorecard">View scorecard</Link>
          </Button>
        </div>
      </Card>

      <Card className="gap-0 py-0">
        <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
          <h2 className="font-semibold tracking-tight">Review answers</h2>
          <span className="font-mono text-xs text-muted-foreground">
            {correct} of {total} right
          </span>
        </div>
        <ol className="divide-y" data-testid="review">
          {questions.map((q, i) => {
            const answer = answers[i]
            const right = answer === q.correct
            return (
              <li key={i} className="flex gap-4 px-5 py-5 sm:px-6">
                <span
                  className={cn(
                    "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
                    right ? "bg-success/15 text-success" : answer === null ? "bg-muted text-muted-foreground" : "bg-destructive/15 text-destructive"
                  )}
                >
                  {right ? <CheckIcon className="size-3.5" /> : answer === null ? <TimerOffIcon className="size-3.5" /> : <XIcon className="size-3.5" />}
                </span>
                <div className="min-w-0 flex-1 space-y-1.5 text-sm">
                  <p className="font-medium text-pretty">
                    <span className="mr-1.5 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    {q.question}
                  </p>
                  {right ? (
                    <p className="text-muted-foreground">Your answer: {answer}</p>
                  ) : (
                    <>
                      <p className="text-muted-foreground">
                        {answer === null ? (
                          "No answer (time ran out)"
                        ) : (
                          <>
                            Your answer: <span className="text-destructive line-through decoration-destructive/40">{answer}</span>
                          </>
                        )}
                      </p>
                      <p className="text-muted-foreground">
                        Correct answer: <span className="font-medium text-foreground">{q.correct}</span>
                      </p>
                    </>
                  )}
                  <Explanation question={q} answer={answer} onLocked={() => setSubscribeOpen(true)} />
                </div>
              </li>
            )
          })}
        </ol>
      </Card>
      <SubscribeDialog open={subscribeOpen} onOpenChange={setSubscribeOpen} />
    </div>
  )
}

type ExplanationState =
  | { status: "idle" | "loading" }
  | { status: "done"; text: string }
  | { status: "error"; message: string }

type ExplanationProps = {
  question: Question
  answer: string | null
  /** Called instead of asking the AI while AI_LOCKED is on */
  onLocked: () => void
}

/** An "Explain" button that asks the AI why the correct answer is right. */
function Explanation({ question, answer, onLocked }: ExplanationProps) {
  const [state, setState] = useState<ExplanationState>({ status: "idle" })

  const explain = async () => {
    if (AI_LOCKED) {
      onLocked()
      return
    }
    setState({ status: "loading" })
    try {
      setState({ status: "done", text: await explainAnswer(question, answer) })
    } catch (err) {
      setState({ status: "error", message: err instanceof QuizError ? err.message : "Something went wrong. Please try again." })
    }
  }

  if (state.status === "done") {
    return (
      <p
        className="mt-2 flex animate-in gap-2 rounded-xl border border-primary/20 bg-primary/[0.05] px-3.5 py-3 leading-relaxed text-foreground duration-300 fade-in-0"
        data-testid="explanation"
      >
        <SparklesIcon className="mt-0.5 size-3.5 shrink-0 text-primary" aria-label="AI explanation" />
        <span>{state.text}</span>
      </p>
    )
  }

  const loading = state.status === "loading"
  return (
    <div className="pt-1">
      <Button variant="ghost" size="xs" onClick={explain} disabled={loading} className="-ml-2 text-muted-foreground" data-testid="explain">
        {loading ? <Loader2Icon className="animate-spin" data-icon="inline-start" /> : <SparklesIcon data-icon="inline-start" />}
        {loading ? "Explaining…" : state.status === "error" ? "Try again" : "Explain"}
        {AI_LOCKED && (
          <>
            <LockIcon data-icon="inline-end" className="opacity-70" />
            <span className="sr-only">(subscribers only)</span>
          </>
        )}
      </Button>
      {state.status === "error" && (
        <p className="text-xs text-destructive" role="alert">
          {state.message}
        </p>
      )}
    </div>
  )
}

function Stat({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div className="px-2 py-5">
      <dd className={cn("text-3xl font-semibold tracking-tight tabular-nums", className)}>{value}</dd>
      <dt className="mt-0.5 font-mono text-[0.65rem] tracking-wider text-muted-foreground uppercase">{label}</dt>
    </div>
  )
}
