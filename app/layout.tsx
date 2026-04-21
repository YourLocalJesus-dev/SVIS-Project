import type { Metadata, Viewport } from "next"
import { Space_Mono, VT323 } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CrtShell } from "@/components/crt/crt-shell"
import { StoreProvider } from "@/lib/store"

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
})

const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
  display: "swap",
})

export const metadata: Metadata = {
  title: "NEON-DRIVE // Study Terminal",
  description: "A retro-futurist command center for the 21st-century student. Study like it's 1986.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#ebe3cf",
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${vt323.variable} bg-background`}>
      <body className="font-sans antialiased min-h-dvh">
        <StoreProvider>
          <CrtShell>{children}</CrtShell>
        </StoreProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
