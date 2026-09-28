import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { useDocumentTitle } from "@/hooks/use-document-title"

export default function NotFoundPage() {
  useDocumentTitle("Page not found")
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted-foreground">The page you're looking for doesn't exist or has moved.</p>
      <div className="mt-8 flex gap-3">
        <Button asChild className="h-9">
          <Link to="/">Go home</Link>
        </Button>
        <Button asChild variant="outline" className="h-9">
          <Link to="/quiz">Play a quiz</Link>
        </Button>
      </div>
    </div>
  )
}
