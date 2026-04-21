"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { useStore } from "@/lib/store"
import { GlitchText } from "./glitch-text"
import { Monitor, MonitorOff, Gamepad2 } from "lucide-react"

const LINKS = [
  { href: "/", label: "CMD" },
  { href: "/missions", label: "MSN" },
  { href: "/focus", label: "FCS" },
  { href: "/archive", label: "ARC" },
]

export function TopNav() {
  const pathname = usePathname()
  const { crtMode, toggleCRT, arcadeUnlocked } = useStore()

  // Logo click easter egg: 5 rapid clicks → toggle CRT
  const clicksRef = React.useRef<number[]>([])
  const onLogoClick = () => {
    const now = Date.now()
    clicksRef.current = [...clicksRef.current.filter((t) => now - t < 1500), now]
    if (clicksRef.current.length >= 5) {
      clicksRef.current = []
      toggleCRT()
      window.dispatchEvent(
        new CustomEvent("neon-toast", {
          detail: { title: "CRT MODE", body: "display rewired // scanlines toggled" },
        }),
      )
    }
  }

  return (
    <header className="sticky top-0 z-40 -mx-4 mb-2 border-b-2 border-foreground bg-background/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="group flex items-baseline gap-2 text-left"
          aria-label="Toggle CRT (tap 5 times fast)"
        >
          <div className="flex h-6 w-6 items-center justify-center border border-foreground bg-foreground text-background">
            <span className="font-display text-lg leading-none">N</span>
          </div>
          <div className="leading-none">
            <GlitchText
              as="span"
              className="font-display text-2xl tracking-widest"
              text="NEON-DRIVE"
            />
            <div className="mt-0.5 hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:block">
              v1.0.86 // study.terminal
            </div>
          </div>
        </button>

        {/* Nav */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className="group relative px-2 py-1 font-display text-xl tracking-widest sm:px-3"
              >
                <span className="relative z-10">
                  {active ? `[${l.label}]` : l.label}
                </span>
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="pointer-events-none absolute inset-0 -z-10 bg-accent/0 transition-colors group-hover:bg-accent/20" />
              </Link>
            )
          })}

          {arcadeUnlocked && (
            <Link
              href="/arcade"
              className={`flex items-center gap-1 border border-primary px-2 py-1 font-display text-lg tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground ${
                pathname === "/arcade" ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              <Gamepad2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">ARCADE</span>
            </Link>
          )}

          {/* CRT toggle */}
          <button
            onClick={toggleCRT}
            className="ml-1 flex h-8 w-8 items-center justify-center border border-foreground transition-colors hover:bg-foreground hover:text-background"
            aria-label="Toggle CRT mode"
            title={crtMode ? "Disable CRT" : "Enable CRT"}
          >
            {crtMode ? <Monitor className="h-4 w-4" /> : <MonitorOff className="h-4 w-4" />}
          </button>
        </nav>
      </div>
    </header>
  )
}
