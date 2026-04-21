"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

type Toast = { id: number; title: string; body: string }

export function EasterEggToaster() {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  React.useEffect(() => {
    const onEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail as { title: string; body: string }
      if (!detail) return
      const id = Date.now() + Math.random()
      setToasts((t) => [...t, { id, ...detail }])
      window.setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id))
      }, 4200)
    }
    window.addEventListener("neon-toast", onEvent as EventListener)
    return () => window.removeEventListener("neon-toast", onEvent as EventListener)
  }, [])

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[70] flex w-[320px] max-w-[calc(100vw-2rem)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 24, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 24, filter: "blur(4px)" }}
            transition={{ duration: 0.22 }}
            className="bracket-frame pointer-events-auto border border-foreground bg-background p-3 shadow-[4px_4px_0_0_var(--foreground)]"
          >
            <div className="font-display text-lg leading-none tracking-widest text-primary">
              {t.title}
            </div>
            <div className="mt-1 font-mono text-xs text-foreground">{t.body}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
