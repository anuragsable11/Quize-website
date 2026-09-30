import { useMemo } from "react"
import { Link } from "react-router"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ArrowRightIcon, ChartLineIcon, CircleHelpIcon, InfoIcon, SettingsIcon, TargetIcon, TrophyIcon } from "lucide-react"
import { Eyebrow } from "@/components/page-header"
import { UserAvatar } from "@/components/user-avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { useAuth } from "@/lib/auth"
import { getScoresFor } from "@/lib/storage"
import { cn } from "@/lib/utils"

const chartConfig = {
  percent: { label: "Score", color: "var(--chart-1)" },
} satisfies ChartConfig

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export default function ScorecardPage() {
  useDocumentTitle("Scorecard")
  const { user } = useAuth()

  // Older entries only have the "3/5" string; newer ones also store the numbers.
  const attempts = useMemo(
    () =>
      getScoresFor(user).map((s, i) => {
        const [c, t] = s.score.split("/").map(Number)
        const correct = s.correct ?? c ?? 0
        const total = s.total ?? t ?? 0
        return {
          number: i + 1,
          correct,
          total,
          percent: total ? Math.round((correct / total) * 100) : 0,
          category: s.category,
          difficulty: s.difficulty && s.difficulty !== "any" ? capitalize(s.difficulty) : null,
          date: s.date ? new Date(s.date) : null,
        }
      }),
    [user]
  )

  const stats = useMemo(() => {
    if (!attempts.length) return null
    const percents = attempts.map((a) => a.percent)
    return {
      played: attempts.length,
      average: Math.round(percents.reduce((a, b) => a + b, 0) / percents.length),
      best: Math.max(...percents),
      questions: attempts.reduce((sum, a) => sum + a.total, 0),
    }
  }, [attempts])

  const name = user?.name ?? "Guest"

  return (
    <div className="relative isolate mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 md:py-14">
      <div
        aria-hidden
        className="absolute inset-x-0 -top-16 -z-10 h-96 bg-[radial-gradient(50%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent)]"
      />
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
        <UserAvatar name={name} src={user?.profileImage} className="size-16 text-xl ring-4 ring-primary/10 ring-offset-2 ring-offset-background" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <Eyebrow>Scorecard</Eyebrow>
          <h1 className="truncate text-3xl font-semibold tracking-tight sm:text-4xl" data-testid="scorecard-name">{name}</h1>
          <p className="truncate text-sm text-muted-foreground">{user ? user.email : "Guest scores saved in this browser"}</p>
        </div>
        <div className="flex gap-2">
          {user && (
            <Button variant="outline" asChild className="h-10 rounded-xl px-4">
              <Link to="/profile">
                <SettingsIcon data-icon="inline-start" /> Profile settings
              </Link>
            </Button>
          )}
          <Button asChild className="h-10 rounded-xl px-4">
            <Link to="/quiz">
              Play a quiz <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>

      {!user && (
        <Alert>
          <InfoIcon />
          <AlertTitle>You're playing as a guest</AlertTitle>
          <AlertDescription>
            <p>
              Your scores are saved in this browser only. <Link to="/signup">Create an account</Link> or{" "}
              <Link to="/login">log in</Link> to keep them under your name.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" data-testid="stats">
        <StatCard icon={ChartLineIcon} label="Quizzes played" value={stats ? String(stats.played) : "0"} />
        <StatCard icon={TargetIcon} label="Average score" value={stats ? `${stats.average}%` : "–"} />
        <StatCard icon={TrophyIcon} label="Best score" value={stats ? `${stats.best}%` : "–"} />
        <StatCard icon={CircleHelpIcon} label="Questions answered" value={stats ? String(stats.questions) : "0"} />
      </div>

      {attempts.length === 0 ? (
        <Card className="items-center gap-3 py-16 text-center" data-testid="empty-state">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-8 ring-primary/[0.04]">
            <ChartLineIcon className="size-6" />
          </div>
          <CardTitle className="font-semibold">No quizzes yet</CardTitle>
          <CardDescription className="max-w-sm">Finish a quiz and your results will show up here, with a chart of your progress.</CardDescription>
          <Button asChild className="mt-3 h-10 rounded-xl px-5">
            <Link to="/quiz">Play your first quiz</Link>
          </Button>
        </Card>
      ) : (
        <>
          {/* Chart */}
          <Card className="gap-4 py-6" data-testid="chart-card">
            <CardHeader className="px-6">
              <CardTitle className="font-semibold">Score history</CardTitle>
              <CardDescription>Percentage of correct answers in each quiz, oldest to newest.</CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
                <AreaChart data={attempts} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fill-percent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-percent)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-percent)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="number" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(n) => `#${n}`} minTickGap={16} />
                  <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickLine={false} axisLine={false} width={44} tickFormatter={(v) => `${v}%`} />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        indicator="line"
                        labelFormatter={(_, payload) => `Attempt #${payload?.[0]?.payload?.number ?? ""}`}
                        formatter={(value) => (
                          <span className="flex w-full justify-between gap-4">
                            <span className="text-muted-foreground">Score</span>
                            <span className="font-medium tabular-nums">{String(value)}%</span>
                          </span>
                        )}
                      />
                    }
                  />
                  <Area
                    dataKey="percent"
                    type="monotone"
                    stroke="var(--color-percent)"
                    strokeWidth={2}
                    fill="url(#fill-percent)"
                    dot={attempts.length <= 20 ? { r: 3, fill: "var(--color-percent)", strokeWidth: 0 } : false}
                    activeDot={{ r: 4 }}
                    animationDuration={700}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Attempts */}
          <Card className="gap-4 py-6">
            <CardHeader className="px-6">
              <CardTitle className="font-semibold">All attempts</CardTitle>
              <CardDescription>Most recent first.</CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <Table data-testid="attempts-table">
                <TableHeader className="[&_th]:font-mono [&_th]:text-[0.7rem] [&_th]:tracking-wider [&_th]:text-muted-foreground [&_th]:uppercase">
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden sm:table-cell">Difficulty</TableHead>
                    <TableHead className="hidden text-right sm:table-cell">Score</TableHead>
                    <TableHead className="text-right">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...attempts].reverse().map((a) => (
                    <TableRow key={a.number}>
                      <TableCell className="text-muted-foreground tabular-nums">{a.number}</TableCell>
                      <TableCell className="tabular-nums">
                        {a.date ? a.date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "–"}
                      </TableCell>
                      <TableCell>{a.category ?? "–"}</TableCell>
                      <TableCell className="hidden sm:table-cell">{a.difficulty ?? "Any"}</TableCell>
                      <TableCell className="hidden text-right tabular-nums sm:table-cell">
                        {a.correct}/{a.total}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "tabular-nums",
                            a.percent >= 80 && "bg-success/15 text-success",
                            a.percent < 50 && "bg-destructive/10 text-destructive"
                          )}
                        >
                          {a.percent}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <Card className="gap-2 py-5">
      <CardContent className="px-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.7rem] tracking-wider text-muted-foreground uppercase">{label}</span>
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" />
          </span>
        </div>
        <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      </CardContent>
    </Card>
  )
}
