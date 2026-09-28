import { Link } from "react-router"
import { Logo } from "@/components/logo"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs space-y-2">
          <Logo />
          <p className="text-sm text-muted-foreground">A universe of trivia. Timed quizzes and a scorecard that tracks your progress.</p>
        </div>
        <nav aria-label="Footer" className="flex gap-10 text-sm">
          <div className="space-y-2">
            <p className="font-medium">Product</p>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/quiz" className="hover:text-foreground">Play a quiz</Link></li>
              <li><Link to="/scorecard" className="hover:text-foreground">Scorecard</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Account</p>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/login" className="hover:text-foreground">Log in</Link></li>
              <li><Link to="/signup" className="hover:text-foreground">Sign up</Link></li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Quizverse</p>
          <p>
            Questions from the{" "}
            <a href="https://opentdb.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-3 hover:text-foreground">
              Open Trivia Database
            </a>
            , licensed{" "}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-3 hover:text-foreground">
              CC BY-SA 4.0
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
