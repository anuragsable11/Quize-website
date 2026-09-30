import type { ReactNode } from "react"
import { CheckIcon } from "lucide-react"
import { Logo, LogoMark } from "@/components/logo"
import { OrbitArt } from "@/components/orbit-art"
import { ProgressRing } from "@/components/progress-ring"

const POINTS = ["17 categories and three difficulty levels", "A scorecard that charts every attempt", "Keyboard shortcuts for fast play"]

/** Split layout shared by the log in and sign up pages: brand panel on the left, form on the right. */
export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 md:py-12 lg:min-h-[calc(100svh-4rem-6rem)] lg:grid-cols-2">
      {/* Brand panel: always dark, like the Pro showcase */}
      <div className="dark relative isolate hidden overflow-hidden rounded-[2rem] border bg-background p-10 text-foreground shadow-elevated lg:flex lg:flex-col">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="bg-stars absolute inset-0 opacity-50" />
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_100%,color-mix(in_oklch,var(--primary)_30%,transparent),transparent)]" />
          <OrbitArt className="absolute top-[38%] left-1/2 h-[720px] w-[1400px] -translate-x-1/2 -translate-y-1/2" />
        </div>
        <Logo />

        {/* A result card floating in orbit */}
        <div aria-hidden className="my-10 flex flex-1 items-center justify-center select-none">
          <div className="flex animate-float items-center gap-4 rounded-2xl border bg-card/70 py-4 pr-6 pl-4 shadow-elevated backdrop-blur-xl">
            <ProgressRing value={0.9} size={64} strokeWidth={5} indicatorClassName="text-success">
              <span className="font-mono text-sm font-semibold">9/10</span>
            </ProgressRing>
            <div>
              <p className="font-semibold">Excellent result</p>
              <p className="text-sm text-muted-foreground">Science &amp; Nature · Hard</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-4xl leading-tight font-semibold tracking-[-0.03em] text-balance">
            A universe of <span className="text-brand-gradient pr-0.5 font-serif font-normal tracking-normal italic">trivia</span>, one quiz
            at a time.
          </h2>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <CheckIcon className="size-3" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center py-6 lg:py-0">
        <div className="w-full max-w-sm">
          <LogoMark className="mb-6 size-11 rounded-xl lg:hidden" />
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 space-y-2 border-t pt-6 text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  )
}
