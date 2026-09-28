import { AlertCircleIcon, ArrowRightIcon, Loader2Icon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

  return (
    <Card className="mx-auto w-full max-w-2xl gap-6 py-6">
      <CardHeader className="px-6">
        <CardTitle className="text-xl font-semibold tracking-tight">Set up your quiz</CardTitle>
        <CardDescription data-testid="greeting">{greeting}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-6">
        <div className="grid gap-5 sm:grid-cols-2">
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
                {QUESTION_COUNTS.map((n) => (
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
              <Loader2Icon className="animate-spin" data-icon="inline-start" /> Loading questions…
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

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}
