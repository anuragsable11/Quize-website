import { CheckIcon, CircleCheckIcon, CircleXIcon, TimerIcon, TimerOffIcon, XIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Question } from "@/lib/trivia"
import { cn } from "@/lib/utils"

type Props = {
  question: Question
  index: number
  total: number
  score: number
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
    <Card className="mx-auto w-full max-w-3xl gap-0 py-0" data-testid="question-card">
      <CardContent className="space-y-6 px-6 pt-6 pb-6">
        {/* Header: position, tags, timer */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-sm font-medium tabular-nums" data-testid="question-position">
            Question {index + 1} <span className="text-muted-foreground">of {total}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{question.category}</Badge>
            <Badge variant="outline" className="capitalize">{question.difficulty}</Badge>
          </div>
          <span
            data-testid="timer"
            className={cn(
              "ml-auto flex items-center gap-1.5 text-sm font-medium tabular-nums",
              lowTime ? "text-destructive" : "text-muted-foreground"
            )}
            aria-live="off"
          >
            <TimerIcon className="size-4" /> {remaining}s
          </span>
        </div>
        <Progress
          key={index}
          value={(remaining / seconds) * 100}
          aria-label="Time remaining"
          className={cn(
            "h-1.5 [&>[data-slot=progress-indicator]]:duration-1000 [&>[data-slot=progress-indicator]]:ease-linear",
            lowTime && "[&>[data-slot=progress-indicator]]:bg-destructive"
          )}
        />

        <h2 className="text-xl font-semibold tracking-tight text-pretty sm:text-2xl" data-testid="question-text">
          {question.question}
        </h2>

        {/* Answers */}
        <div className="grid gap-2.5" role="group" aria-label="Answers">
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
                  "group flex w-full items-center gap-3 rounded-lg border bg-card px-4 py-3 text-left text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  state === "idle" && "hover:border-foreground/20 hover:bg-muted/50",
                  state === "selected" && "border-primary bg-primary/5 ring-1 ring-primary",
                  state === "correct" && "border-success bg-success/10 ring-1 ring-success",
                  state === "wrong" && "border-destructive bg-destructive/10 ring-1 ring-destructive",
                  state === "dimmed" && "opacity-55",
                  checked && "cursor-default"
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-md border text-xs font-medium text-muted-foreground",
                    state === "selected" && "border-primary bg-primary text-primary-foreground",
                    state === "correct" && "border-success bg-success text-white",
                    state === "wrong" && "border-destructive bg-destructive text-white"
                  )}
                >
                  {state === "correct" ? <CheckIcon className="size-3.5" /> : state === "wrong" ? <XIcon className="size-3.5" /> : String.fromCharCode(65 + i)}
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
              "flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm",
              wasCorrect ? "bg-success/10 text-success" : "bg-muted text-foreground"
            )}
          >
            {wasCorrect ? (
              <>
                <CircleCheckIcon className="mt-0.5 size-4 shrink-0" /> Correct.
              </>
            ) : selected ? (
              <>
                <CircleXIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
                <span>
                  Incorrect. The answer is <strong className="font-medium">{question.correct}</strong>.
                </span>
              </>
            ) : (
              <>
                <TimerOffIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>
                  Time's up. The answer is <strong className="font-medium">{question.correct}</strong>.
                </span>
              </>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-3 px-6 py-4">
        <span className="text-sm text-muted-foreground tabular-nums" data-testid="live-score">
          Score <span className="font-medium text-foreground">{score}</span>
        </span>
        <span className="hidden text-xs text-muted-foreground lg:inline">
          Press <Kbd>1</Kbd>–<Kbd>4</Kbd> to choose, <Kbd>Enter</Kbd> to {checked ? "continue" : "submit"}
        </span>
        <div className="ml-auto flex gap-2">
          <Button variant="ghost" onClick={onQuit}>
            Quit
          </Button>
          {checked ? (
            <Button onClick={onNext} data-testid="next">
              {isLast ? "See results" : "Next question"}
            </Button>
          ) : (
            <Button onClick={onSubmit} disabled={!selected} data-testid="submit">
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
    <kbd className="mx-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded border bg-background px-1 font-sans text-[0.7rem] font-medium">
      {children}
    </kbd>
  )
}
