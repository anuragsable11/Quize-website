import { cn } from "@/lib/utils"

/** The Quizverse mark: a "Q" drawn as an orbit ring with a satellite. Same artwork as public/logo.svg. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-8 shrink-0", className)}>
      <defs>
        <linearGradient id="qv-mark-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366F1" />
          <stop offset="1" stopColor="#4338CA" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#qv-mark-bg)" />
      <circle cx="15" cy="15.5" r="7" fill="none" stroke="#fff" strokeWidth="2.75" />
      <path d="M19.4 20l4.1 4.1" fill="none" stroke="#fff" strokeWidth="2.75" strokeLinecap="round" />
      <circle cx="23.6" cy="8.4" r="2.1" fill="#fff" fillOpacity="0.85" />
    </svg>
  )
}

/** Mark + wordmark, as used in the header and footer. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className="size-7" />
      <span className="text-[1.05rem] font-semibold tracking-tight">Quizverse</span>
    </span>
  )
}
