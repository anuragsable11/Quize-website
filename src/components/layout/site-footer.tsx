import { Link } from "react-router"
import { ArrowRightIcon } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"

const COLUMNS = [
  {
    title: "Product",
    links: [
      { to: "/quiz", label: "Play a quiz" },
      { to: "/scorecard", label: "Scorecard" },
      { to: "/#features", label: "Features" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/login", label: "Log in" },
      { to: "/signup", label: "Sign up" },
      { to: "/profile", label: "Profile settings" },
    ],
  },
]

const CREDITS = [
  { href: "https://opentdb.com/", label: "Open Trivia Database" },
  { href: "https://creativecommons.org/licenses/by-sa/4.0/", label: "CC BY-SA 4.0 licence" },
  { href: "https://huggingface.co/", label: "Hugging Face" },
]

const linkClass = "text-muted-foreground transition-colors hover:text-foreground"

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-14 pb-10 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="max-w-xs space-y-4">
          <div className="space-y-2">
            <Logo />
            <p className="font-mono text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">Play · Learn · Grow</p>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A universe of trivia. Timed quizzes across 17 categories, and a scorecard that tracks your progress.
          </p>
          <Button asChild size="sm" variant="outline" className="rounded-full pl-3">
            <Link to="/quiz">
              Start a quiz <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title} className="space-y-3 text-sm">
            <p className="font-mono text-[0.7rem] tracking-[0.16em] text-muted-foreground/80 uppercase">{column.title}</p>
            <ul className="space-y-2.5">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="space-y-3 text-sm">
          <p className="font-mono text-[0.7rem] tracking-[0.16em] text-muted-foreground/80 uppercase">Credits</p>
          <ul className="space-y-2.5">
            {CREDITS.map((credit) => (
              <li key={credit.href}>
                <a href={credit.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {credit.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="divider-fade h-px" />
        <div className="flex flex-col gap-1 py-5 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Quizverse. All rights reserved.</p>
          <p>Questions from the Open Trivia Database, licensed CC BY-SA 4.0.</p>
        </div>
      </div>

      {/* Oversized wordmark, cropped by the bottom edge */}
      <p
        aria-hidden
        className="pointer-events-none -mb-[0.28em] text-center text-[19vw] leading-none font-semibold tracking-tighter select-none lg:text-[15rem]"
      >
        <span className="bg-linear-to-b from-foreground/[0.07] to-transparent bg-clip-text text-transparent">Quizverse</span>
      </p>
    </footer>
  )
}
