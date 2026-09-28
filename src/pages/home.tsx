import { Link } from "react-router"
import {
  ArrowRightIcon,
  ChartLineIcon,
  CheckIcon,
  CircleCheckIcon,
  KeyboardIcon,
  LayoutGridIcon,
  ListChecksIcon,
  TimerIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"

const STATS = [
  { value: "17", label: "Categories" },
  { value: "3", label: "Difficulty levels" },
  { value: "5–50", label: "Questions per quiz" },
  { value: "10–60s", label: "Time per question" },
]

const FEATURES = [
  {
    icon: LayoutGridIcon,
    title: "17 categories",
    text: "From science and history to film, music and sport. Pick one or mix them all.",
  },
  {
    icon: TimerIcon,
    title: "Timed questions",
    text: "Choose between 10 and 60 seconds per question to practise under pressure.",
  },
  {
    icon: CircleCheckIcon,
    title: "Instant feedback",
    text: "See the correct answer straight after each question, while it's still fresh.",
  },
  {
    icon: ChartLineIcon,
    title: "Progress tracking",
    text: "Every attempt is saved to your scorecard, with best and average scores over time.",
  },
  {
    icon: ListChecksIcon,
    title: "Answer review",
    text: "Go through every question at the end to see exactly what you missed.",
  },
  {
    icon: KeyboardIcon,
    title: "Keyboard friendly",
    text: "Answer with keys 1–4 and press Enter to submit. No mouse needed.",
  },
]

const STEPS = [
  { title: "Choose your settings", text: "Pick a category, a difficulty, how many questions and how much time per question." },
  { title: "Answer against the clock", text: "Select an answer and submit. You'll see the right answer immediately." },
  { title: "Review and improve", text: "Check your results, review your answers and follow your progress on the scorecard." },
]

export default function HomePage() {
  useDocumentTitle()
  const { user } = useAuth()

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b">
        <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(55%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent)]"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.1fr_1fr]">
          <div className="max-w-xl">
            <Badge variant="outline" className="h-auto gap-2 rounded-full bg-background px-3 py-1 text-xs font-normal text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" />
              Free to play · No account needed
            </Badge>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Test what you know.{" "}
              <span className="text-muted-foreground">See how you improve.</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Quizverse serves timed multiple-choice quizzes across 17 categories and three difficulty levels,
              and keeps a scorecard of every attempt so you can track your progress over time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="h-10 px-5" asChild>
                <Link to="/quiz">
                  Start a quiz <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
              {user ? (
                <Button size="lg" variant="outline" className="h-10 px-5" asChild>
                  <Link to="/scorecard">View your scorecard</Link>
                </Button>
              ) : (
                <Button size="lg" variant="outline" className="h-10 px-5" asChild>
                  <Link to="/signup">Create a free account</Link>
                </Button>
              )}
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["Thousands of questions", "Instant feedback", "Progress tracking"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-success" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <QuizPreview />
        </div>
      </section>

      {/* Stats */}
      <section aria-label="At a glance" className="border-b">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 px-4 sm:px-6 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "flex flex-col gap-1 py-8",
                // first column lines up with the page content; the rest are inset from their divider
                i % 2 === 1 && "border-l pl-6",
                i > 0 && "md:border-l md:pl-6",
                i >= 2 && "border-t md:border-t-0"
              )}
            >
              <dt className="order-2 text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="order-1 text-3xl font-semibold tracking-tight tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Features</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Everything you need to practise</h2>
          <p className="mt-3 text-muted-foreground">
            A focused quiz experience with no clutter: set it up in seconds, play, and learn from the results.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="gap-0 py-6">
              <CardContent className="px-6">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-medium">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Three steps, under a minute to start</h2>
          </div>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative">
                <span className="flex size-8 items-center justify-center rounded-full border bg-background text-sm font-medium tabular-nums">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-medium">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Call to action */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="relative isolate overflow-hidden rounded-2xl border bg-card px-6 py-12 text-center sm:px-12">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_100%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]"
          />
          <h2 className="text-3xl font-semibold tracking-tight">Ready to test your knowledge?</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Start a quiz right away as a guest, or create an account to keep your scores under your name.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="h-10 px-5" asChild>
              <Link to="/quiz">
                Start a quiz <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
            {!user && (
              <Button size="lg" variant="outline" className="h-10 px-5" asChild>
                <Link to="/signup">Create an account</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

/** Static illustration of the quiz screen for the hero. */
function QuizPreview() {
  const answers = ["Mercury", "Jupiter", "Saturn", "Earth"]
  return (
    <div aria-hidden className="pointer-events-none relative mx-auto w-full max-w-md select-none lg:mx-0 lg:ml-auto">
      <Card className="gap-5 py-6 shadow-2xl shadow-primary/10">
        <CardContent className="space-y-5 px-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Question 4 of 10</span>
            <span className="flex items-center gap-1.5 font-medium tabular-nums">
              <TimerIcon className="size-4 text-muted-foreground" /> 12s
            </span>
          </div>
          <Progress value={60} className="h-1.5" />
          <div className="flex gap-2">
            <Badge variant="secondary">Science &amp; Nature</Badge>
            <Badge variant="outline">Medium</Badge>
          </div>
          <p className="text-lg font-semibold tracking-tight">Which planet has the shortest day in our solar system?</p>
          <div className="space-y-2">
            {answers.map((answer, i) => {
              const selected = answer === "Jupiter"
              return (
                <div
                  key={answer}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm",
                    selected && "border-primary bg-primary/5 ring-1 ring-primary"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-md border text-xs font-medium text-muted-foreground",
                      selected && "border-primary bg-primary text-primary-foreground"
                    )}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {answer}
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-sm text-muted-foreground">Score 3</span>
            <span className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground">
              Submit answer
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
