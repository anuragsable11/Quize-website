import { useState, type CSSProperties, type ReactNode } from "react"
import { Link } from "react-router"
import {
  ArrowRightIcon,
  CheckIcon,
  CircleCheckIcon,
  CornerDownLeftIcon,
  FlameIcon,
  LockIcon,
  SparklesIcon,
  TimerIcon,
  XIcon,
} from "lucide-react"
import { OrbitArt } from "@/components/orbit-art"
import { Eyebrow } from "@/components/page-header"
import { ProgressRing } from "@/components/progress-ring"
import { CATEGORY_ICONS } from "@/components/quiz/category-icons"
import { SubscribeDialog } from "@/components/subscribe-dialog"
import { Button } from "@/components/ui/button"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { useAuth } from "@/lib/auth"
import { CATEGORIES } from "@/lib/trivia"
import { cn } from "@/lib/utils"

const STATS = [
  { value: "17", label: "Categories" },
  { value: "3", label: "Difficulty levels" },
  { value: "5–50", label: "Questions per quiz" },
  { value: "10–60s", label: "Per question" },
]

const STEPS = [
  { title: "Choose your settings", text: "Pick a category, a difficulty, how many questions and how long you get for each." },
  { title: "Answer against the clock", text: "Choose an answer before the timer runs out. You see the right one straight away." },
  { title: "Review and improve", text: "Go through every answer, then follow your progress over time on your scorecard." },
]

// Staggered entrance for the hero
const rise = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` })

export default function HomePage() {
  useDocumentTitle()
  const { user } = useAuth()
  const [proOpen, setProOpen] = useState(false)

  return (
    <>
      <Hero signedIn={!!user} />
      <CategoryMarquee />
      <Features onPro={() => setProOpen(true)} />
      <HowItWorks />
      <ProShowcase onUnlock={() => setProOpen(true)} />
      <FinalCta signedIn={!!user} />
      <SubscribeDialog open={proOpen} onOpenChange={setProOpen} />
    </>
  )
}

// ---------- hero ----------

function Hero({ signedIn }: { signedIn: boolean }) {
  return (
    // Pulled up under the transparent header so the glow runs to the top of the window
    <section className="relative isolate -mt-16 overflow-hidden pt-16">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-70" />
        <div className="absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(45%_55%_at_50%_0%,color-mix(in_oklch,var(--primary)_20%,transparent),transparent)]" />
        <div className="bg-stars absolute inset-x-0 top-0 h-[760px] opacity-25 [mask-image:linear-gradient(to_bottom,#000,transparent)] dark:opacity-60" />
        {/* Centred on the product preview, so it sits in orbit */}
        <OrbitArt className="absolute top-[470px] left-1/2 h-[720px] w-[1400px] -translate-x-1/2 md:top-[500px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-14 text-center sm:px-6 md:pt-20">
        <Link
          to="/quiz"
          style={rise(0)}
          className="group inline-flex animate-rise items-center gap-2 rounded-full border bg-background/70 py-1 pr-3 pl-1 text-xs font-medium shadow-xs backdrop-blur transition-colors hover:border-primary/30"
        >
          <span className="bg-brand-gradient rounded-full px-2 py-0.5 text-[0.7rem] font-semibold text-white">New</span>
          AI quizzes on any topic
          <span className="text-muted-foreground">· Pro</span>
          <ArrowRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>

        <h1
          style={rise(80)}
          className="mx-auto mt-8 max-w-4xl animate-rise text-[2.75rem] leading-[1.02] font-semibold tracking-[-0.04em] text-balance sm:text-6xl md:text-7xl"
        >
          Test what you know.
          <br />
          <span className="text-brand-gradient pr-2 font-serif text-[1.1em] font-normal tracking-[-0.01em] italic">See how you grow.</span>
        </h1>

        <p style={rise(160)} className="mx-auto mt-6 max-w-xl animate-rise text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          Timed multiple-choice quizzes across 17 categories and three difficulty levels, with a scorecard that shows how
          you improve over time.
        </p>

        <div style={rise(240)} className="mt-9 flex animate-rise flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="h-11 rounded-full pr-4 pl-6 text-[0.95rem]">
            <Link to="/quiz">
              Start a quiz <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-11 rounded-full px-6 text-[0.95rem] backdrop-blur">
            <Link to={signedIn ? "/scorecard" : "/signup"}>{signedIn ? "View your scorecard" : "Create a free account"}</Link>
          </Button>
        </div>

        <ul
          style={rise(320)}
          className="mt-7 flex animate-rise flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-[0.7rem] tracking-wider text-muted-foreground uppercase"
        >
          {["Free to play", "No account needed", "Keyboard friendly"].map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <CheckIcon className="size-3.5 text-success" /> {item}
            </li>
          ))}
        </ul>
      </div>

      <HeroPreview />

      <dl className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border px-0 md:grid-cols-4 [&>div]:bg-background/85 [&>div]:backdrop-blur">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 px-6 py-6">
            <dt className="order-2 font-mono text-[0.7rem] tracking-wider text-muted-foreground uppercase">{stat.label}</dt>
            <dd className="order-1 text-3xl font-semibold tracking-tight tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>
      <div className="h-20" />
    </section>
  )
}

/** Illustration of the quiz screen, with floating detail cards. */
function HeroPreview() {
  const answers = ["Mercury", "Jupiter", "Saturn", "Earth"]
  const results = ["ok", "ok", "miss", "ok", "ok", "ok", "now", "", "", ""]

  return (
    <div aria-hidden style={rise(420)} className="relative mx-auto mt-16 max-w-3xl animate-rise px-4 select-none sm:px-6">
      {/* Window frame */}
      <div className="rounded-[1.75rem] border bg-card/60 p-2 shadow-elevated backdrop-blur-xl">
        <div className="flex items-center gap-1.5 px-3 pt-1.5 pb-2.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2.5 rounded-full bg-foreground/10" />
          ))}
          <span className="mx-auto font-mono text-[0.65rem] tracking-widest text-muted-foreground uppercase">Quizverse · Play</span>
          <span className="w-10" />
        </div>
        <div className="rounded-[1.25rem] border bg-card p-5 text-left sm:p-7">
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs text-muted-foreground">
                Question <span className="text-foreground">7</span> / 10
              </p>
              <div className="mt-2 flex gap-1">
                {results.map((r, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full bg-foreground/[0.08]",
                      r === "ok" && "bg-success",
                      r === "miss" && "bg-destructive",
                      r === "now" && "bg-primary"
                    )}
                  />
                ))}
              </div>
            </div>
            <ProgressRing value={0.4} size={46} strokeWidth={3.5}>
              <span className="font-mono text-xs font-medium">12</span>
            </ProgressRing>
          </div>

          <div className="mt-5 flex gap-2">
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">Science &amp; Nature</span>
            <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium">Medium</span>
          </div>
          <p className="mt-4 text-xl font-semibold tracking-tight text-balance sm:text-2xl">
            Which planet has the shortest day in our solar system?
          </p>
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {answers.map((answer, i) => {
              const correct = answer === "Jupiter"
              return (
                <div
                  key={answer}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm",
                    correct ? "border-success/60 bg-success/10 ring-1 ring-success/40" : "opacity-60"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-md border font-mono text-[0.7rem] text-muted-foreground",
                      correct && "border-success bg-success text-white"
                    )}
                  >
                    {correct ? <CheckIcon className="size-3.5" /> : String.fromCharCode(65 + i)}
                  </span>
                  {answer}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Floating details */}
      <FloatCard className="-bottom-7 -left-16 hidden md:flex" delay="0s">
        <span className="flex size-8 items-center justify-center rounded-full bg-success/15 text-success">
          <CircleCheckIcon className="size-4.5" />
        </span>
        <span>
          <span className="block text-sm font-semibold">Correct!</span>
          <span className="block text-xs text-muted-foreground">+1 point · 6 in a row</span>
        </span>
      </FloatCard>
      <FloatCard className="-top-8 -right-20 hidden md:flex" delay="-3s">
        <span className="flex size-8 items-center justify-center rounded-full bg-warning/15 text-warning">
          <FlameIcon className="size-4.5" />
        </span>
        <span>
          <span className="block text-sm font-semibold tabular-nums">86% average</span>
          <span className="block text-xs text-muted-foreground">Best score this week</span>
        </span>
      </FloatCard>
    </div>
  )
}

function FloatCard({ className, delay, children }: { className?: string; delay: string; children: ReactNode }) {
  return (
    <div
      style={{ animationDelay: delay }}
      className={cn(
        "absolute animate-float items-center gap-3 rounded-2xl border bg-popover/90 py-2.5 pr-4 pl-2.5 text-left shadow-elevated backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  )
}

// ---------- categories ----------

function CategoryMarquee() {
  const categories = CATEGORIES.filter((c) => c.id)
  return (
    <section aria-labelledby="categories-title" className="border-y bg-muted/30 py-8">
      <h2 id="categories-title" className="text-center font-mono text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase">
        17 categories to explore
      </h2>
      <div className="mask-fade-x group mt-6 flex overflow-hidden">
        {/* The list is repeated so the loop is seamless; the copy is hidden from assistive tech */}
        {[false, true].map((copy) => (
          <ul
            key={String(copy)}
            aria-hidden={copy || undefined}
            className="flex w-max shrink-0 animate-marquee gap-3 pr-3 group-hover:[animation-play-state:paused]"
          >
            {categories.map((c) => {
              const Icon = CATEGORY_ICONS[c.id]
              return (
                <li key={c.id}>
                  <Link
                    to={`/quiz?category=${c.id}`}
                    tabIndex={copy ? -1 : undefined}
                    className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium whitespace-nowrap shadow-xs transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Icon className="size-4 text-primary" /> {c.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        ))}
      </div>
    </section>
  )
}

// ---------- features ----------

function SectionIntro({ eyebrow, title, text, className }: { eyebrow: string; title: ReactNode; text?: string; className?: string }) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      <Eyebrow centered>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-pretty text-muted-foreground sm:text-lg">{text}</p>}
    </div>
  )
}

const Accent = ({ children }: { children: ReactNode }) => (
  <span className="text-brand-gradient pr-1 font-serif font-normal tracking-normal italic">{children}</span>
)

function Features({ onPro }: { onPro: () => void }) {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6 md:py-32">
      <SectionIntro
        eyebrow="Features"
        title={
          <>
            Everything you need to <Accent>practise smarter</Accent>
          </>
        }
        text="A focused quiz experience without the clutter. Set it up in seconds, play, and learn from every result."
      />

      <div className="mt-16 grid gap-4 md:grid-cols-6">
        <Bento className="md:col-span-4" title="Timed questions" text="Choose 10 to 60 seconds per question and practise under real pressure.">
          <div className="flex w-full max-w-sm items-center gap-5">
            <ProgressRing value={0.66} size={84} strokeWidth={6}>
              <span className="font-mono text-xl font-semibold">20</span>
            </ProgressRing>
            <div className="flex-1 space-y-3">
              <p className="font-mono text-xs text-muted-foreground">Question 4 / 10</p>
              <div className="flex gap-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <span key={i} className={cn("h-1.5 flex-1 rounded-full", i < 3 ? "bg-success" : i === 3 ? "bg-primary" : "bg-foreground/[0.08]")} />
                ))}
              </div>
              <div className="h-2 w-3/4 rounded-full bg-foreground/[0.06]" />
              <div className="h-2 w-1/2 rounded-full bg-foreground/[0.06]" />
            </div>
          </div>
        </Bento>

        <Bento className="md:col-span-2" title="Instant feedback" text="See the right answer the moment you submit.">
          <div className="w-full max-w-56 space-y-2 text-sm">
            <div className="flex items-center gap-2.5 rounded-xl border border-success/50 bg-success/10 px-3 py-2">
              <CheckIcon className="size-4 text-success" /> Jupiter
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2">
              <XIcon className="size-4 text-destructive" /> Saturn
            </div>
          </div>
        </Bento>

        <Bento className="md:col-span-2" title="Progress tracking" text="Every attempt lands on your scorecard, charted over time.">
          <Sparkline />
        </Bento>

        <Bento className="md:col-span-2" title="Answer review" text="Walk through every question at the end to see exactly what you missed.">
          <ul className="w-full max-w-56 space-y-2.5">
            {[true, false, true].map((ok, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <span className={cn("flex size-5 items-center justify-center rounded-full", ok ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive")}>
                  {ok ? <CheckIcon className="size-3" /> : <XIcon className="size-3" />}
                </span>
                <span className="h-2 flex-1 rounded-full bg-foreground/[0.07]" style={{ maxWidth: `${[85, 65, 75][i]}%` }} />
              </li>
            ))}
          </ul>
        </Bento>

        <Bento className="md:col-span-2" title="Keyboard friendly" text="Answer with 1 to 4 and press Enter. No mouse needed.">
          <div className="flex gap-1.5">
            {["1", "2", "3", "4"].map((key) => (
              <Keycap key={key}>{key}</Keycap>
            ))}
            <Keycap wide>
              <CornerDownLeftIcon className="size-4" />
            </Keycap>
          </div>
        </Bento>

        <Bento className="md:col-span-3" title="17 categories" text="From science and history to film, music and sport. Pick one or mix them all.">
          <div className="grid grid-cols-6 gap-2">
            {CATEGORIES.filter((c) => c.id)
              .slice(0, 12)
              .map((c) => {
                const Icon = CATEGORY_ICONS[c.id]
                return (
                  <span key={c.id} title={c.name} className="flex size-10 items-center justify-center rounded-xl border bg-background text-muted-foreground">
                    <Icon className="size-4.5" />
                  </span>
                )
              })}
          </div>
        </Bento>

        <Bento
          className="md:col-span-3"
          highlight
          title={
            <span className="flex items-center gap-2">
              AI quizzes and explanations
              <span className="bg-brand-gradient rounded-full px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-white uppercase">Pro</span>
            </span>
          }
          text="Get a fresh quiz on any topic you type, and a clear explanation for every answer."
          action={
            <Button size="sm" variant="outline" onClick={onPro} className="rounded-full">
              <LockIcon data-icon="inline-start" /> Unlock with Pro
            </Button>
          }
        >
          <div className="w-full max-w-xs space-y-2.5">
            <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm shadow-xs">
              <span className="flex-1 text-muted-foreground">Ancient Rome</span>
              <span className="bg-brand-gradient flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-white">
                <SparklesIcon className="size-3" /> Generate
              </span>
            </div>
            <div className="rounded-xl bg-muted px-3 py-2 text-xs leading-relaxed text-muted-foreground">
              <SparklesIcon className="mr-1 inline size-3 text-primary" />
              Augustus became Rome's first emperor in 27 BC…
            </div>
          </div>
        </Bento>
      </div>
    </section>
  )
}

function Bento({
  title,
  text,
  action,
  highlight,
  className,
  children,
}: {
  title: ReactNode
  text: string
  action?: ReactNode
  highlight?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border bg-card shadow-card transition-shadow hover:shadow-elevated",
        highlight && "border-primary/25",
        className
      )}
    >
      {highlight && (
        <div aria-hidden className="absolute inset-0 -z-0 bg-[radial-gradient(70%_60%_at_100%_0%,color-mix(in_oklch,var(--brand)_14%,transparent),transparent)]" />
      )}
      <div aria-hidden className="relative flex h-44 items-center justify-center border-b bg-[radial-gradient(60%_80%_at_50%_100%,color-mix(in_oklch,var(--primary)_7%,transparent),transparent)] px-6">
        {children}
      </div>
      <div className="relative flex flex-1 flex-col gap-1.5 p-6">
        <h3 className="font-semibold tracking-tight">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  )
}

function Keycap({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <span
      className={cn(
        "flex h-11 items-center justify-center rounded-lg border border-b-[3px] bg-background font-mono text-sm font-medium shadow-xs",
        wide ? "w-14" : "w-11"
      )}
    >
      {children}
    </span>
  )
}

function Sparkline() {
  const points = [38, 52, 45, 60, 58, 72, 66, 80, 86]
  const w = 220
  const h = 80
  const step = w / (points.length - 1)
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / 100) * h}`).join(" ")
  return (
    <svg viewBox={`0 0 ${w} ${h + 4}`} className="w-full max-w-60 overflow-visible text-primary">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L ${w} ${h + 4} L 0 ${h + 4} Z`} fill="url(#spark-fill)" />
      <path d={line} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - (points.at(-1)! / 100) * h} r="4" fill="currentColor" className="drop-shadow-[0_0_6px_currentColor]" />
    </svg>
  )
}

// ---------- how it works ----------

function HowItWorks() {
  return (
    <section className="relative border-y bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-28">
        <SectionIntro
          eyebrow="How it works"
          title={
            <>
              From zero to quiz in <Accent>under a minute</Accent>
            </>
          }
        />
        <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          <div aria-hidden className="divider-fade absolute top-5 right-[16%] left-[16%] hidden h-px md:block" />
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative text-center">
              <span className="relative mx-auto flex size-10 items-center justify-center rounded-full border bg-background font-mono text-sm font-medium shadow-card">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

// ---------- pro ----------

function ProShowcase({ onUnlock }: { onUnlock: () => void }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      {/* Always dark: the "dark" class switches every colour token inside this panel */}
      <div className="dark relative isolate overflow-hidden rounded-[2rem] border bg-background text-foreground shadow-elevated">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="bg-stars absolute inset-0 opacity-50" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_85%_20%,color-mix(in_oklch,var(--brand)_28%,transparent),transparent)]" />
          <OrbitArt core={false} className="absolute -right-80 -bottom-40 h-[720px] w-[1400px] opacity-70" />
        </div>

        <div className="grid items-center gap-12 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium">
              <SparklesIcon className="size-3.5 text-brand" /> Quizverse Pro
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
              Let AI write <Accent>your next quiz</Accent>
            </h2>
            <p className="mt-4 max-w-md text-pretty text-muted-foreground sm:text-lg">
              Type any topic and get a fresh quiz in seconds. Stuck on an answer? Get a clear, friendly explanation.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {["AI quizzes on any topic you choose", "AI explanations for every answer", "Everything in the free plan"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <CheckIcon className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Button onClick={onUnlock} size="lg" className="mt-10 h-11 rounded-full px-6 text-[0.95rem]">
              <LockIcon data-icon="inline-start" /> Unlock Pro
            </Button>
          </div>

          <div aria-hidden className="relative space-y-3 select-none">
            <div className="rounded-2xl border bg-card/80 p-4 shadow-card backdrop-blur">
              <p className="font-mono text-[0.65rem] tracking-widest text-muted-foreground uppercase">Topic</p>
              <div className="mt-2 flex items-center gap-2 rounded-xl border bg-background px-3 py-2.5 text-sm">
                <span className="flex-1">The Mughal Empire</span>
                <span className="bg-brand-gradient flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-white">
                  <SparklesIcon className="size-3" /> Generate
                </span>
              </div>
            </div>
            <div className="rounded-2xl border bg-card/80 p-5 shadow-card backdrop-blur">
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-secondary px-2 py-0.5 font-medium">The Mughal Empire</span>
                <span className="flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium">
                  <SparklesIcon className="size-3" /> AI-generated
                </span>
                <span className="ml-auto flex items-center gap-1 font-mono text-muted-foreground">
                  <TimerIcon className="size-3.5" /> 24s
                </span>
              </div>
              <p className="mt-3 font-semibold tracking-tight">Which emperor commissioned the Taj Mahal?</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                {["Akbar", "Shah Jahan", "Babur", "Aurangzeb"].map((a) => (
                  <span key={a} className={cn("rounded-lg border px-3 py-2", a === "Shah Jahan" && "border-success/60 bg-success/10")}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <div className="ml-8 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm leading-relaxed shadow-card backdrop-blur">
              <p className="flex items-center gap-1.5 text-xs font-medium text-primary">
                <SparklesIcon className="size-3.5" /> Explanation
              </p>
              <p className="mt-1.5 text-muted-foreground">
                Shah Jahan built the Taj Mahal in Agra as a tomb for his wife Mumtaz Mahal, starting in 1632.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------- call to action ----------

function FinalCta({ signedIn }: { signedIn: boolean }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 md:pb-32">
      <div className="relative isolate overflow-hidden rounded-[2rem] border bg-card px-6 py-20 text-center shadow-card sm:px-12">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(50%_70%_at_50%_100%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent)]" />
          <OrbitArt className="absolute top-1/2 left-1/2 h-[720px] w-[1400px] -translate-x-1/2 opacity-60" />
        </div>
        <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
          Ready when <Accent>you are</Accent>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-pretty text-muted-foreground sm:text-lg">
          Start a quiz right away as a guest, or create an account to keep every score under your name.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="h-11 rounded-full pr-4 pl-6 text-[0.95rem]">
            <Link to="/quiz">
              Start a quiz <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
          {!signedIn && (
            <Button asChild size="lg" variant="outline" className="h-11 rounded-full px-6 text-[0.95rem]">
              <Link to="/signup">Create an account</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
