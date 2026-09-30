import { useState, type ReactNode } from "react"
import { ToggleGroup } from "radix-ui"
import { AlertCircleIcon, ArrowRightIcon, ClockIcon, LibraryIcon, Loader2Icon, LockIcon, SparklesIcon } from "lucide-react"
import { CATEGORY_ICONS } from "@/components/quiz/category-icons"
import { SegmentedControl } from "@/components/segmented-control"
import { SubscribeDialog } from "@/components/subscribe-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AI_LOCKED, AI_QUESTION_COUNTS } from "@/lib/ai"
import { CATEGORIES, categoryName, DIFFICULTIES, QUESTION_COUNTS, TIME_LIMITS, type QuizSettings } from "@/lib/trivia"

type Props = {
  settings: QuizSettings
  onChange: (settings: QuizSettings) => void
  onStart: () => void
  loading: boolean
  error: string | null
  greeting: string
}

// Radix toggle groups can't use "" as an item value, so "any" stands in for it.
const ANY = "any"

/** "Up to 5 min" for the longest the quiz can take. */
const maxDuration = (seconds: number) => (seconds < 60 ? `${seconds} sec` : `${Math.round(seconds / 60)} min`)

export function QuizSetup({ settings, onChange, onStart, loading, error, greeting }: Props) {
  const set = <K extends keyof QuizSettings>(key: K, value: QuizSettings[K]) => onChange({ ...settings, [key]: value })
  const ai = settings.source === "ai"
  const [subscribeOpen, setSubscribeOpen] = useState(false)

  // AI quizzes offer fewer questions, so a longer quiz shrinks to the longest AI one
  const setSource = (source: QuizSettings["source"]) =>
    onChange({ ...settings, source, amount: source === "ai" ? Math.min(settings.amount, Math.max(...AI_QUESTION_COUNTS)) : settings.amount })

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start">
        {/* What to play */}
        <Card className="gap-0 py-0">
          <div className="border-b p-5 sm:p-6">
            <FieldLabel id="source-label">Questions from</FieldLabel>
            <SegmentedControl
              aria-labelledby="source-label"
              data-testid="source"
              value={settings.source}
              onValueChange={(v) => {
                if (v === "ai" && AI_LOCKED) setSubscribeOpen(true)
                else setSource(v as QuizSettings["source"])
              }}
              options={[
                {
                  value: "trivia",
                  label: (
                    <>
                      <LibraryIcon /> Trivia database
                    </>
                  ),
                },
                {
                  value: "ai",
                  label: (
                    <>
                      <SparklesIcon /> AI, any topic
                      {AI_LOCKED && (
                        <>
                          <LockIcon className="size-3.5! opacity-60" />
                          <span className="sr-only">(subscribers only)</span>
                        </>
                      )}
                    </>
                  ),
                },
              ]}
            />
          </div>

          <div className="p-5 sm:p-6">
            {ai ? (
              <div>
                <FieldLabel htmlFor="topic">Topic</FieldLabel>
                <div className="relative">
                  <SparklesIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-primary" />
                  <Input
                    id="topic"
                    value={settings.topic}
                    onChange={(e) => set("topic", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !loading && onStart()}
                    placeholder="e.g. Ancient Rome or cricket"
                    maxLength={100}
                    autoComplete="off"
                    autoFocus
                    className="h-12 rounded-xl pl-10 text-base md:text-base"
                  />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  The AI writes a fresh quiz on your topic in a few seconds. It can occasionally get a fact wrong.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline justify-between">
                  <FieldLabel id="category-label">Category</FieldLabel>
                  <span className="font-mono text-[0.7rem] text-muted-foreground">{CATEGORIES.length - 1} categories</span>
                </div>
                <ToggleGroup.Root
                  type="single"
                  aria-labelledby="category-label"
                  data-testid="category"
                  value={settings.category || ANY}
                  onValueChange={(v) => v && set("category", v === ANY ? "" : v)}
                  className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                >
                  {CATEGORIES.map((c) => {
                    const Icon = CATEGORY_ICONS[c.id]
                    return (
                      <ToggleGroup.Item
                        key={c.id || ANY}
                        value={c.id || ANY}
                        className="group flex min-h-13 items-center gap-2.5 rounded-xl border bg-card px-2.5 py-2 text-left text-[0.8rem] leading-tight font-medium transition-all outline-none hover:border-foreground/20 hover:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=on]:border-primary data-[state=on]:bg-primary/[0.06] data-[state=on]:ring-1 data-[state=on]:ring-primary sm:text-sm"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:text-foreground group-data-[state=on]:bg-primary group-data-[state=on]:text-primary-foreground">
                          <Icon className="size-4" />
                        </span>
                        {c.name}
                      </ToggleGroup.Item>
                    )
                  })}
                </ToggleGroup.Root>
              </div>
            )}
          </div>
        </Card>

        {/* How to play it */}
        <Card className="gap-0 py-0 lg:sticky lg:top-24">
          <div className="space-y-6 p-5 sm:p-6">
            <div>
              <FieldLabel id="difficulty-label">Difficulty</FieldLabel>
              <SegmentedControl
                aria-labelledby="difficulty-label"
                data-testid="difficulty"
                value={settings.difficulty || ANY}
                onValueChange={(v) => set("difficulty", v === ANY ? "" : v)}
                options={DIFFICULTIES.map((d) => ({ value: d.id || ANY, label: d.id ? d.name : "Any" }))}
              />
            </div>
            <div>
              <FieldLabel id="amount-label">Questions</FieldLabel>
              <SegmentedControl
                aria-labelledby="amount-label"
                data-testid="amount"
                value={String(settings.amount)}
                onValueChange={(v) => set("amount", Number(v))}
                options={(ai ? AI_QUESTION_COUNTS : QUESTION_COUNTS).map((n) => ({ value: String(n), label: n }))}
                itemClassName="px-1"
              />
            </div>
            <div>
              <FieldLabel id="seconds-label">Time per question</FieldLabel>
              <SegmentedControl
                aria-labelledby="seconds-label"
                data-testid="seconds"
                value={String(settings.seconds)}
                onValueChange={(v) => set("seconds", Number(v))}
                options={TIME_LIMITS.map((s) => ({ value: String(s), label: `${s}s` }))}
                itemClassName="px-1"
              />
            </div>
          </div>

          <div className="space-y-4 border-t bg-muted/40 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{ai ? settings.topic.trim() || "Your topic" : categoryName(settings.category)}</p>
                <p className="text-muted-foreground">
                  {settings.amount} questions · {DIFFICULTIES.find((d) => d.id === settings.difficulty)?.name ?? "Any difficulty"}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 font-mono text-xs text-muted-foreground">
                <ClockIcon className="size-3.5" /> ≤ {maxDuration(settings.amount * settings.seconds)}
              </span>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button size="lg" className="h-11 w-full rounded-xl text-[0.95rem]" onClick={onStart} disabled={loading}>
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin" data-icon="inline-start" /> {ai ? "Writing questions…" : "Loading questions…"}
                </>
              ) : (
                <>
                  Start quiz <ArrowRightIcon data-icon="inline-end" />
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground" data-testid="greeting">
              {greeting}
            </p>
          </div>
        </Card>
      </div>
      <SubscribeDialog open={subscribeOpen} onOpenChange={setSubscribeOpen} />
    </>
  )
}

function FieldLabel({ id, htmlFor, children }: { id?: string; htmlFor?: string; children: ReactNode }) {
  const className = "mb-2.5 block font-mono text-[0.7rem] font-medium tracking-[0.14em] text-muted-foreground uppercase"
  return htmlFor ? (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  ) : (
    <p id={id} className={className}>
      {children}
    </p>
  )
}
