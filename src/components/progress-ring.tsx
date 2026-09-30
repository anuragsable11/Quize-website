import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Props = {
  /** 0 to 1 */
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  /** Classes for the filled arc, e.g. a text colour (the arc uses currentColor) */
  indicatorClassName?: string
  children?: ReactNode
}

/** A circular progress indicator with optional content in the middle. */
export function ProgressRing({ value, size = 48, strokeWidth = 4, className, indicatorClassName, children }: Props) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(1, Math.max(0, value))

  return (
    <div className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg aria-hidden width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-foreground/[0.08]" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          className={cn("text-primary transition-[stroke-dashoffset,color] duration-1000 ease-linear", indicatorClassName)}
        />
      </svg>
      {children}
    </div>
  )
}
