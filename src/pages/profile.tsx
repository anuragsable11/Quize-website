import { useRef, useState, type FormEvent } from "react"
import { Link, Navigate } from "react-router"
import { AlertCircleIcon, UploadIcon } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/page-header"
import { UserAvatar } from "@/components/user-avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { useAuth } from "@/lib/auth"
import { resizeImage } from "@/lib/media"

export default function ProfilePage() {
  useDocumentTitle("Profile settings")
  const { user } = useAuth()
  // Guests have no profile to edit
  if (!user) return <Navigate to="/login?next=/profile" replace />
  return <ProfileForm />
}

function ProfileForm() {
  const { user, updateProfile } = useAuth()
  const fileInput = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(user!.name)
  const [photo, setPhoto] = useState<string | undefined>(user!.profileImage)
  const [error, setError] = useState<string | null>(null)

  const dirty = name.trim() !== user!.name || photo !== user!.profileImage

  const onPickPhoto = async (file?: File) => {
    if (!file) return
    setError(null)
    try {
      setPhoto(await resizeImage(file))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      if (fileInput.current) fileInput.current.value = ""
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Please enter your name.")
      return
    }
    try {
      updateProfile({ name, profileImage: photo })
      setError(null)
      toast.success("Profile updated.")
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 md:py-14">
      <PageHeader eyebrow="Account" title="Profile settings" description="Update the name and photo shown on your scorecard." className="mb-8" />

      <form onSubmit={onSubmit}>
        <Card className="gap-6 pt-6">
          <CardHeader className="px-6">
            <CardTitle className="font-semibold">Your profile</CardTitle>
            <CardDescription>Changes are saved to this browser.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6">
            <div className="flex items-center gap-5">
              <UserAvatar name={name || user!.name} src={photo} className="size-20 text-xl ring-4 ring-primary/10 ring-offset-2 ring-offset-card" />
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" className="h-9 rounded-lg" onClick={() => fileInput.current?.click()}>
                    <UploadIcon data-icon="inline-start" /> Upload photo
                  </Button>
                  {photo && (
                    <Button type="button" variant="ghost" className="h-9 rounded-lg" onClick={() => setPhoto(undefined)}>
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">JPG, PNG or WebP. Cropped to a square and resized.</p>
                <input
                  ref={fileInput}
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  tabIndex={-1}
                  aria-label="Profile photo"
                  onChange={(e) => onPickPhoto(e.target.files?.[0])}
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="h-11 rounded-xl px-3.5" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user!.email} disabled className="h-11 rounded-xl px-3.5" />
              <p className="text-xs text-muted-foreground">Your email is used to sign in and can't be changed.</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="justify-end gap-2 px-6 py-4">
            <Button type="button" variant="ghost" asChild className="h-10 rounded-xl px-4">
              <Link to="/scorecard">Back to scorecard</Link>
            </Button>
            <Button type="submit" className="h-10 rounded-xl px-5" disabled={!dirty}>
              Save changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
