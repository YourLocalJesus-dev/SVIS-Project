"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { useStore } from "@/lib/store"
import { TopNav } from "./top-nav"
import { StatusBar } from "./status-bar"
import { BootSequence } from "./boot-sequence"
import { KonamiListener } from "./konami-listener"
import { EasterEggToaster } from "./easter-egg-toaster"

export function CrtShell({ children }: { children: React.ReactNode }) {
  const { crtMode, bootSeen, hydrated } = useStore()
  const pathname = usePathname()
  const [bootDone, setBootDone] = React.useState(false)

  // Only show boot splash on first ever visit (once store has hydrated from LS).
  const showBoot = hydrated && !bootSeen && !bootDone

  return (
    <>
      {/* Ambient CRT layers — only when enabled */}
      {crtMode && (
        <>
          <div className="crt-grain" aria-hidden />
          <div className="crt-scanlines" aria-hidden />
          <div className="crt-vignette" aria-hidden />
        </>
      )}

      {/* App frame — always renders, so there is never a blank screen */}
      <div className={crtMode ? "crt-flicker" : ""}>
        <div className="mx-auto flex min-h-dvh max-w-[1400px] flex-col px-4 sm:px-6 lg:px-8">
          <TopNav />

          <main className="flex-1 py-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>

          <StatusBar />
        </div>
      </div>

      {/* Boot splash overlay on very first visit — layered on top, never blocks content */}
      <AnimatePresence>
        {showBoot && <BootSequence onDone={() => setBootDone(true)} />}
      </AnimatePresence>

      {/* Global keybinding easter eggs */}
      <KonamiListener />
      <EasterEggToaster />
    </>
  )
}
