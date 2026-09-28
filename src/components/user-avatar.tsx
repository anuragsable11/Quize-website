import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { initials } from "@/lib/auth"
import { cn } from "@/lib/utils"

/** A user's photo, falling back to their initials. */
export function UserAvatar({
  name,
  src,
  className,
}: {
  name: string
  src?: string
  className?: string
}) {
  return (
    <Avatar className={className}>
      {src && <AvatarImage src={src} alt="" />}
      <AvatarFallback className={cn("bg-primary/10 font-medium text-primary")}>{initials(name)}</AvatarFallback>
    </Avatar>
  )
}
