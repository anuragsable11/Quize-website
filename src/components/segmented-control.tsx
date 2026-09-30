import type { ReactNode } from "react"
import { ToggleGroup } from "radix-ui"
import { cn } from "@/lib/utils"

type Option = { value: string; label: ReactNode }

type Props = {
  value: string
  onValueChange: (value: string) => void
  options: Option[]
  className?: string
  itemClassName?: string
  "aria-label"?: string
  "aria-labelledby"?: string
  "data-testid"?: string
}

/** A row of mutually exclusive options, one always selected. */
export function SegmentedControl({ value, onValueChange, options, className, itemClassName, ...rest }: Props) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      // Radix reports "" when the selected item is clicked again; keep the selection instead
      onValueChange={(v) => v && onValueChange(v)}
      className={cn("flex gap-1 rounded-xl bg-muted p-1 ring-1 ring-foreground/[0.04] ring-inset", className)}
      {...rest}
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            "flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-medium whitespace-nowrap text-muted-foreground tabular-nums transition-all outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-[0_1px_2px_oklch(0_0_0/0.1),0_0_0_1px_oklch(0_0_0/0.04)] dark:data-[state=on]:bg-accent dark:data-[state=on]:shadow-[inset_0_1px_0_oklch(1_0_0/0.06),0_1px_2px_oklch(0_0_0/0.4)] [&_svg]:size-4 [&_svg]:shrink-0",
            itemClassName
          )}
        >
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  )
}
