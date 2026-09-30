import { useState } from "react"
import { Link } from "react-router"
import { CheckIcon, Loader2Icon, LockIcon, RotateCcwIcon, SlidersHorizontalIcon, SparklesIcon, TimerOffIcon, XIcon } from "lucide-react"
import { SubscribeDialog } from "@/components/subscribe-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

  const verdict =
    percent >= 80
      ? { title: "Excellent result", text: "You clearly know this topic well." }
      : percent >= 50
        ? { title: "Good effort", text: "A solid score. Review the questions you missed below." }
        : { title: "Keep practising", text: "Review the answers below and try again." }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <Card className="gap-6 py-6" data-testid="results">
        <CardHeader className="px-6 text-center">
          <p className="text-sm font-medium text-muted-foreground">Your score</p>
          <p className="text-5xl font-semibold tracking-tight tabular-nums" data-testid="final-score">
            {correct}
            <span className="text-muted-foreground">/{total}</span>
          </p>
          <div className="flex justify-center">
            <Badge variant="secondary" className="tabular-nums">{percent}%</Badge>
          </div>
          <CardTitle className="mt-2 text-lg font-semibold" data-testid="verdict">{verdict.title}</CardTitle>
          <CardDescription>{verdict.text}</CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <dl className="grid grid-cols-3 divide-x rounded-lg border text-center">
            <Stat label="Correct" value={correct} className="text-success" />
            <Stat label="Incorrect" value={incorrect} className="text-destructive" />
            <Stat label="Timed out" value={timedOut} className="text-muted-foreground" />
          </dl>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={onPlayAgain} disabled={loading} className="h-9" data-testid="play-again">
              <RotateCcwIcon data-icon="inline-start" /> {loading ? "Loading…" : "Play again"}
            </Button>
            <Button variant="outline" onClick={onChangeSettings} className="h-9">
              <SlidersHorizontalIcon data-icon="inline-start" /> Change settings
            </Button>
            <Button variant="ghost" asChild className="h-9">
              <Link to="/scorecard">View scorecard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-4 py-6">
        <CardHeader className="px-6">
          <CardTitle className="font-semibold">Review answers</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <ol className="divide-y" data-testid="review">
            {questions.map((q, i) => {
              const answer = answers[i]
              const right = answer === q.correct
              return (
                <li key={i} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                      right ? "bg-success/15 text-success" : answer === null ? "bg-muted text-muted-foreground" : "bg-destructive/15 text-destructive"
                    )}
                  >
                    {right ? <CheckIcon className="size-3" /> : answer === null ? <TimerOffIcon className="size-3" /> : <XIcon className="size-3" />}
                  </span>
                  <div className="min-w-0 space-y-1 text-sm">
                    <p className="font-medium">
                      {i + 1}. {q.question}
                    </p>
                    {right ? (
                      <p className="text-muted-foreground">Your answer: {answer}</p>
                    ) : (
                      <>
                        <p className="text-muted-foreground">
                          {answer === null ? "No answer (time ran out)" : <>Your answer: <span className="text-destructive">{answer}</span></>}
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
        </CardContent>
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
      <p className="mt-2 flex gap-2 rounded-lg bg-muted px-3 py-2.5 text-foreground" data-testid="explanation">
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
    <div className="px-2 py-4">
      <dd className={cn("text-2xl font-semibold tabular-nums", className)}>{value}</dd>
      <dt className="text-xs text-muted-foreground">{label}</dt>
    </div>
  )
}
