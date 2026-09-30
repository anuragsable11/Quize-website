import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Small uppercase label above a heading. Centred headings get a rule on both sides. */
export function Eyebrow({ children, centered, className }: { children: ReactNode; centered?: boolean; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2 font-mono text-[0.7rem] font-medium tracking-[0.18em] text-primary uppercase", className)}>
      <span aria-hidden className="h-px w-5 bg-linear-to-l from-primary/60 to-transparent" />
      {children}
      {centered && <span aria-hidden className="h-px w-5 bg-linear-to-r from-primary/60 to-transparent" />}
    </p>
  )
}

/** Heading block at the top of inner pages. */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0 space-y-3">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h1>
        {description && <p className="max-w-2xl text-pretty text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
