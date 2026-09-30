import { CheckIcon, SparklesIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const BENEFITS = ["AI quizzes on any topic you choose", "AI explanations for every answer", "Everything in the free plan"]

/** Shown instead of an AI feature while AI_LOCKED is on (see lib/ai.ts). */
export function SubscribeDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="gap-0 overflow-hidden p-0 sm:max-w-md" data-testid="subscribe-dialog">
        {/* Header band: always dark, with the brand glow */}
        <div className="dark relative isolate overflow-hidden bg-background px-6 pt-8 pb-7 text-foreground">
          <div aria-hidden className="absolute inset-0 -z-10">
            <div className="bg-stars absolute inset-0 opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(80%_90%_at_50%_0%,color-mix(in_oklch,var(--brand)_35%,transparent),transparent)]" />
          </div>
          <div className="bg-brand-gradient flex size-12 items-center justify-center rounded-2xl text-white shadow-glow">
            <SparklesIcon className="size-6" />
          </div>
          <p className="mt-5 font-mono text-[0.7rem] font-medium tracking-[0.18em] text-brand uppercase">Quizverse Pro</p>
          <DialogTitle className="mt-1.5 text-2xl font-semibold tracking-tight">Unlock AI features</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon-sm" className="absolute top-3 right-3 rounded-full text-muted-foreground">
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </div>

        <div className="space-y-5 px-6 py-6">
          <DialogDescription className="text-sm">To unlock this feature, you need to subscribe. Subscribers get:</DialogDescription>
          <ul className="space-y-3 text-sm">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <CheckIcon className="size-3" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t bg-muted/40 px-6 py-4">
          <DialogClose asChild>
            <Button className="h-10 w-full rounded-xl">Got it</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
