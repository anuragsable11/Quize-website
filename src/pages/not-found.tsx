import { Link } from "react-router"
import { ArrowRightIcon } from "lucide-react"
import { OrbitArt } from "@/components/orbit-art"
import { Button } from "@/components/ui/button"
import { useDocumentTitle } from "@/hooks/use-document-title"

export default function NotFoundPage() {
  useDocumentTitle("Page not found")
  return (
    <div className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-60" />
        <OrbitArt className="absolute top-0 left-1/2 h-[720px] w-[1400px] -translate-x-1/2" />
      </div>
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-28 text-center sm:py-36">
        <p className="text-brand-gradient font-serif text-[7rem] leading-none italic">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Lost in orbit</h1>
        <p className="mt-3 text-muted-foreground">The page you're looking for doesn't exist or has moved.</p>
        <div className="mt-9 flex gap-3">
          <Button asChild className="h-10 rounded-full px-5">
            <Link to="/">Go home</Link>
          </Button>
          <Button asChild variant="outline" className="h-10 rounded-full pr-4 pl-5">
            <Link to="/quiz">
              Play a quiz <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
