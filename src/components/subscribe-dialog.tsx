import { CheckIcon, SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Shown instead of an AI feature while AI_LOCKED is on (see lib/ai.ts). */
export function SubscribeDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" data-testid="subscribe-dialog">
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <SparklesIcon className="size-5" />
          </div>
          <DialogTitle>Unlock AI features</DialogTitle>
          <DialogDescription>To unlock this feature, you need to subscribe. Subscribers get:</DialogDescription>
        </DialogHeader>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2">
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" /> AI quizzes on any topic you choose
          </li>
          <li className="flex gap-2">
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" /> AI explanations for every answer
          </li>
        </ul>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
