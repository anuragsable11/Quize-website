import { CheckIcon, CircleCheckIcon, CircleXIcon, SparklesIcon, TimerOffIcon, XIcon } from "lucide-react"
import { ProgressRing } from "@/components/progress-ring"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import type { Question } from "@/lib/trivia"
import { cn } from "@/lib/utils"

type Props = {
  question: Question
  index: number
  total: number
  score: number
  /** Whether each answered question was right */
  history: boolean[]
  seconds: number
  remaining: number
  selected: string | null
  checked: boolean
  isLast: boolean
  onSelect: (answer: string) => void
  onSubmit: () => void
  onNext: () => void
  onQuit: () => void
}

export function QuizQuestion({
  question,
  index,
  total,
  score,
  history,
  seconds,
  remaining,
  selected,
  checked,
  isLast,
  onSelect,
  onSubmit,
  onNext,
  onQuit,
}: Props) {
  const lowTime = !checked && remaining <= 5
  const wasCorrect = checked && selected === question.correct

  return (
    <Card className="mx-auto w-full max-w-3xl gap-0 py-0 shadow-elevated" data-testid="question-card">
      <div className="space-y-6 p-5 sm:p-8">
        {/* Header: position, progress, timer */}
        <div className="flex items-center gap-5">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="font-mono text-xs text-muted-foreground tabular-nums" data-testid="question-position">
                Question <span className="font-semibold text-foreground">{index + 1}</span> of {total}
              </span>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">{question.category}</Badge>
                <Badge variant="outline" className="capitalize">
                  {question.difficulty}
                </Badge>
                {question.ai && (
                  <Badge variant="outline" data-testid="ai-badge">
                    <SparklesIcon /> AI-generated
                  </Badge>
                )}
              </div>
            </div>
            {/* One segment per question: green right, red wrong, blue current */}
            <div className="flex gap-1" aria-hidden>
              {Array.from({ length: total }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full bg-foreground/[0.08] transition-colors duration-300",
                    i < history.length && (history[i] ? "bg-success" : "bg-destructive"),
                    i === index && i >= history.length && "bg-primary"
                  )}
                />
              ))}
            </div>
          </div>

          <div data-testid="timer" aria-live="off" aria-label={`${remaining} seconds left`}>
            <ProgressRing
              key={index}
              value={remaining / seconds}
              size={58}
              strokeWidth={4}
              className={cn(lowTime && "animate-pulse")}
              indicatorClassName={lowTime ? "text-destructive" : "text-primary"}
            >
              <span className={cn("font-mono text-sm font-semibold tabular-nums", lowTime && "text-destructive")}>{remaining}s</span>
            </ProgressRing>
          </div>
        </div>

        <h2 className="text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-[1.75rem]" data-testid="question-text">
          {question.question}
        </h2>

        {/* Answers */}
        <div className="grid gap-2.5 sm:grid-cols-2" role="group" aria-label="Answers">
          {question.answers.map((answer, i) => {
            const isSelected = selected === answer
            const isCorrect = answer === question.correct
            const state = checked
              ? isCorrect
                ? "correct"
                : isSelected
                  ? "wrong"
                  : "dimmed"
              : isSelected
                ? "selected"
                : "idle"
            return (
              <button
                key={answer}
                type="button"
                data-state={state}
                data-testid="answer"
                aria-pressed={isSelected}
                disabled={checked}
                onClick={() => onSelect(answer)}
                className={cn(
                  "group flex min-h-15 w-full items-center gap-3.5 rounded-xl border bg-card px-4 py-3 text-left text-[0.95rem] font-medium transition-all duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  state === "idle" && "hover:-translate-y-px hover:border-primary/40 hover:bg-accent/60 hover:shadow-card",
                  state === "selected" && "border-primary bg-primary/[0.06] shadow-glow",
                  state === "correct" && "border-success bg-success/10 ring-1 ring-success",
                  state === "wrong" && "border-destructive bg-destructive/10 ring-1 ring-destructive",
                  state === "dimmed" && "opacity-45",
                  checked && "cursor-default"
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-lg border bg-background font-mono text-xs text-muted-foreground transition-colors",
                    state === "idle" && "group-hover:border-primary/40 group-hover:text-primary",
                    state === "selected" && "border-primary bg-primary text-primary-foreground",
                    state === "correct" && "border-success bg-success text-white",
                    state === "wrong" && "border-destructive bg-destructive text-white"
                  )}
                >
                  {state === "correct" ? <CheckIcon className="size-4" /> : state === "wrong" ? <XIcon className="size-4" /> : String.fromCharCode(65 + i)}
                </span>
                <span className="answer-text flex-1">{answer}</span>
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {checked && (
          <div
            role="status"
            data-testid="feedback"
            className={cn(
              "flex animate-in items-start gap-2.5 rounded-xl px-4 py-3 text-sm duration-300 fade-in-0 slide-in-from-bottom-1",
              wasCorrect ? "bg-success/10 text-success" : "bg-muted text-foreground"
            )}
          >
            {wasCorrect ? (
              <>
                <CircleCheckIcon className="mt-0.5 size-4 shrink-0" /> <span className="font-medium">Correct. Nicely done.</span>
              </>
            ) : selected ? (
              <>
                <CircleXIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
                <span>
                  Incorrect. The answer is <strong className="font-semibold">{question.correct}</strong>.
                </span>
              </>
            ) : (
              <>
                <TimerOffIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>
                  Time's up. The answer is <strong className="font-semibold">{question.correct}</strong>.
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <CardFooter className="gap-3 px-5 py-4 sm:px-8">
        <span className="text-sm text-muted-foreground tabular-nums" data-testid="live-score">
          Score <span className="font-semibold text-foreground">{score}</span>
        </span>
        <span className="hidden text-xs text-muted-foreground lg:inline">
          <Kbd>1</Kbd>–<Kbd>4</Kbd> to choose · <Kbd>Enter</Kbd> to {checked ? "continue" : "submit"}
        </span>
        <div className="ml-auto flex gap-2">
          <Button variant="ghost" onClick={onQuit} className="h-9">
            Quit
          </Button>
          {checked ? (
            <Button onClick={onNext} data-testid="next" className="h-9 px-4">
              {isLast ? "See results" : "Next question"}
            </Button>
          ) : (
            <Button onClick={onSubmit} disabled={!selected} data-testid="submit" className="h-9 px-4">
              Submit answer
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded border border-b-2 bg-background px-1 font-mono text-[0.65rem] font-medium">
      {children}
    </kbd>
  )
}
