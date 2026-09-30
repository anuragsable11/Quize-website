import { ToggleGroup } from "radix-ui"
import { AlertCircleIcon, ArrowRightIcon, LibraryIcon, Loader2Icon, SparklesIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AI_QUESTION_COUNTS } from "@/lib/ai"
import { CATEGORIES, DIFFICULTIES, QUESTION_COUNTS, TIME_LIMITS, type QuizSettings } from "@/lib/trivia"

type Props = {
  settings: QuizSettings
  onChange: (settings: QuizSettings) => void
  onStart: () => void
  loading: boolean
  error: string | null
  greeting: string
}

// Radix Select can't use "" as an item value, so "any" stands in for it.
const ANY = "any"

export function QuizSetup({ settings, onChange, onStart, loading, error, greeting }: Props) {
  const set = <K extends keyof QuizSettings>(key: K, value: QuizSettings[K]) => onChange({ ...settings, [key]: value })
  const ai = settings.source === "ai"

  // AI quizzes offer fewer questions, so a longer quiz shrinks to the longest AI one
  const setSource = (source: QuizSettings["source"]) =>
    onChange({ ...settings, source, amount: source === "ai" ? Math.min(settings.amount, Math.max(...AI_QUESTION_COUNTS)) : settings.amount })

  return (
    <Card className="mx-auto w-full max-w-2xl gap-6 py-6">
      <CardHeader className="px-6">
        <CardTitle className="text-xl font-semibold tracking-tight">Set up your quiz</CardTitle>
        <CardDescription data-testid="greeting">{greeting}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-6">
        <div className="grid gap-2">
          <Label id="source-label">Questions from</Label>
          <ToggleGroup.Root
            type="single"
            value={settings.source}
            onValueChange={(v) => v && setSource(v as QuizSettings["source"])}
            aria-labelledby="source-label"
            className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
            data-testid="source"
          >
            <ToggleGroup.Item value="trivia" className={SOURCE_ITEM}>
              <LibraryIcon /> Trivia database
            </ToggleGroup.Item>
            <ToggleGroup.Item value="ai" className={SOURCE_ITEM}>
              <SparklesIcon /> AI, any topic
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {ai ? (
            <Field id="topic" label="Topic">
              <Input
                id="topic"
                value={settings.topic}
                onChange={(e) => set("topic", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && onStart()}
                placeholder="e.g. Ancient Rome or cricket"
                maxLength={100}
                autoComplete="off"
                autoFocus
                className="h-9"
              />
            </Field>
          ) : (
            <Field id="category" label="Category">
              <Select value={settings.category || ANY} onValueChange={(v) => set("category", v === ANY ? "" : v)}>
                <SelectTrigger id="category" className="w-full data-[size=default]:h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.id || ANY} value={c.id || ANY}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}

          <Field id="difficulty" label="Difficulty">
            <Select value={settings.difficulty || ANY} onValueChange={(v) => set("difficulty", v === ANY ? "" : v)}>
              <SelectTrigger id="difficulty" className="w-full data-[size=default]:h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d.id || ANY} value={d.id || ANY}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field id="amount" label="Number of questions">
            <Select value={String(settings.amount)} onValueChange={(v) => set("amount", Number(v))}>
              <SelectTrigger id="amount" className="w-full data-[size=default]:h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(ai ? AI_QUESTION_COUNTS : QUESTION_COUNTS).map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} questions
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field id="seconds" label="Time per question">
            <Select value={String(settings.seconds)} onValueChange={(v) => set("seconds", Number(v))}>
              <SelectTrigger id="seconds" className="w-full data-[size=default]:h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_LIMITS.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s} seconds
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        {ai && (
          <p className="text-xs text-muted-foreground">
            The AI writes a fresh quiz on your topic in a few seconds. It can occasionally get a fact wrong.
          </p>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="bg-transparent px-6 pt-6">
        <Button size="lg" className="h-10 w-full" onClick={onStart} disabled={loading}>
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
      </CardFooter>
    </Card>
  )
}

const SOURCE_ITEM =
  "flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm dark:data-[state=on]:bg-input/50 [&_svg]:size-4 [&_svg]:shrink-0"

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}
