import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router"
import { ChartLineIcon, LogOutIcon, MenuIcon, UserRoundIcon } from "lucide-react"
import { toast } from "sonner"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAvatar } from "@/components/user-avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/quiz", label: "Play" },
  { to: "/scorecard", label: "Scorecard" },
]

export function SiteHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    toast("You've been logged out.")
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" aria-label="Quizverse home" className="rounded-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "bg-muted text-foreground"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Account menu"
                  data-testid="account-menu"
                  className="rounded-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <UserAvatar name={user.name} src={user.profileImage} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="truncate text-sm font-medium text-foreground">{user.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate("/scorecard")}>
                  <ChartLineIcon /> Scorecard
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate("/profile")}>
                  <UserRoundIcon /> Profile settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout}>
                  <LogOutIcon /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                        isActive && "bg-muted text-foreground"
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
              <Separator />
              <div className="flex flex-col gap-2 px-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-1 pb-2">
                      <UserAvatar name={user.name} src={user.profileImage} />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{user.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <Button variant="outline" asChild onClick={() => setMenuOpen(false)}>
                      <Link to="/profile">Profile settings</Link>
                    </Button>
                    <Button variant="ghost" onClick={handleLogout}>
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild onClick={() => setMenuOpen(false)}>
                      <Link to="/signup">Sign up</Link>
                    </Button>
                    <Button variant="outline" asChild onClick={() => setMenuOpen(false)}>
                      <Link to="/login">Log in</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
