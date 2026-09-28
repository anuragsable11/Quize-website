import type { ReactNode } from "react"
import { LogoMark } from "@/components/logo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/** Centered card layout shared by the log in and sign up pages. */
export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="relative isolate flex justify-center px-4 py-12 sm:py-20">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div className="w-full max-w-sm">
        <Card className="gap-6 py-8 shadow-sm">
          <CardHeader className="px-8 text-center">
            <LogoMark className="mx-auto mb-2 size-10" />
            <CardTitle className="text-xl font-semibold tracking-tight">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="px-8">{children}</CardContent>
        </Card>
        <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">{footer}</div>
      </div>
    </div>
  )
}
