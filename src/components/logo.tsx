import markUrl from "@/assets/logo-mark.webp"
import { cn } from "@/lib/utils"

/**
 * The Quizverse symbol: a "Q" holding a question mark, circled by an orbit.
 * Cropped from the full logo (public/logo-full.png) and shown as a rounded tile.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={markUrl}
      alt=""
      width={36}
      height={36}
      draggable={false}
      className={cn("size-9 shrink-0 rounded-[22%] ring-1 ring-white/10 select-none", className)}
    />
  )
}

/** Symbol + wordmark, as used in the header and footer. "verse" takes the logo's blue-to-violet gradient. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="text-[1.1rem] font-semibold tracking-tight">
        Quiz<span className="text-brand-gradient">verse</span>
      </span>
    </span>
  )
}
