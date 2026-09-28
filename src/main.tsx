import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "next-themes"
import { App } from "@/App"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* storageKey "theme" matches the original site, so a saved light/dark choice carries over */}
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme" disableTransitionOnChange>
      <AuthProvider>
        <TooltipProvider>
          <App />
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
