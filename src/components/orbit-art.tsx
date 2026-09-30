import { useId } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

// Tilted orbits around a glowing core, echoing the orbit in the logo
const RINGS = [
  { rx: 220, ry: 70, dur: 26, start: 0.1 },
  { rx: 360, ry: 118, dur: 40, start: 0.55 },
  { rx: 520, ry: 170, dur: 58, start: 0.3 },
  { rx: 690, ry: 226, dur: 80, start: 0.8 },
]

const CX = 700
const CY = 360

const ellipsePath = (rx: number, ry: number) =>
  `M ${CX - rx},${CY} a ${rx},${ry} 0 1,0 ${rx * 2},0 a ${rx},${ry} 0 1,0 ${-rx * 2},0`

/** Decorative orbit rings with moving satellites. Purely visual; hidden from assistive tech. */
export function OrbitArt({ className, core = true }: { className?: string; core?: boolean }) {
  const id = useId()
  const reduced = useReducedMotion()

  return (
    <svg
      aria-hidden
      viewBox="0 0 1400 720"
      preserveAspectRatio="xMidYMid slice"
      className={cn("pointer-events-none text-foreground", className)}
    >
      <defs>
        <radialGradient id={`${id}-core`}>
          <stop offset="0" stopColor="var(--primary)" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="var(--brand)" stopOpacity="0.16" />
          <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-sat`}>
          <stop offset="0" stopColor="var(--primary)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.02" />
          <stop offset="0.5" stopColor="currentColor" stopOpacity="0.16" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {core && <ellipse cx={CX} cy={CY} rx={320} ry={200} fill={`url(#${id}-core)`} />}

      <g transform={`rotate(-8 ${CX} ${CY})`}>
        {RINGS.map((ring, i) => (
          <ellipse
            key={ring.rx}
            cx={CX}
            cy={CY}
            rx={ring.rx}
            ry={ring.ry}
            fill="none"
            stroke={`url(#${id}-ring)`}
            strokeWidth={1}
            strokeDasharray={i % 2 ? "2 6" : undefined}
          />
        ))}

        {RINGS.map((ring) => {
          const path = ellipsePath(ring.rx, ring.ry)
          // Without motion, park each satellite at its starting point on the ring
          const angle = ring.start * Math.PI * 2
          const at = reduced ? { cx: CX - ring.rx * Math.cos(angle), cy: CY + ring.ry * Math.sin(angle) } : { cx: 0, cy: 0 }
          return (
            <g key={ring.rx}>
              <circle r={14} fill={`url(#${id}-sat)`} {...at}>
                {!reduced && <Motion path={path} dur={ring.dur} start={ring.start} />}
              </circle>
              <circle r={2.6} fill="var(--primary)" {...at}>
                {!reduced && <Motion path={path} dur={ring.dur} start={ring.start} />}
              </circle>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

function Motion({ path, dur, start }: { path: string; dur: number; start: number }) {
  return <animateMotion dur={`${dur}s`} begin={`${-dur * start}s`} repeatCount="indefinite" path={path} />
}
