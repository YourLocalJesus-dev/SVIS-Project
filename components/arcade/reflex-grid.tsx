"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Panel } from "@/components/crt/panel"

type Cell = { id: number; target: boolean }

const GRID = 5 // 5x5
const DURATION = 30 // seconds

export function ReflexGrid() {
  const [phase, setPhase] = React.useState<"idle" | "run" | "done">("idle")
  const [score, setScore] = React.useState(0)
  const [time, setTime] = React.useState(DURATION)
  const [target, setTarget] = React.useState<number | null>(null)
  const [best, setBest] = React.useState(0)

  React.useEffect(() => {
    const saved = Number.parseInt(window.localStorage.getItem("neon-drive:arcade-best") || "0")
    if (Number.isFinite(saved)) setBest(saved)
  }, [])

  // Ticker
  React.useEffect(() => {
    if (phase !== "run") return
    if (time <= 0) {
      setPhase("done")
      setTarget(null)
      setBest((b) => {
        const nb = Math.max(b, score)
        window.localStorage.setItem("neon-drive:arcade-best", String(nb))
        return nb
      })
      return
    }
    const id = window.setTimeout(() => setTime((t) => t - 1), 1000)
    return () => window.clearTimeout(id)
  }, [phase, time, score])

  // Target hopper
  React.useEffect(() => {
    if (phase !== "run") return
    const id = window.setInterval(() => {
      setTarget(Math.floor(Math.random() * GRID * GRID))
    }, 720)
    // seed immediately
    setTarget(Math.floor(Math.random() * GRID * GRID))
    return () => window.clearInterval(id)
  }, [phase])

  const start = () => {
    setPhase("run")
    setScore(0)
    setTime(DURATION)
  }

  const onCell = (idx: number) => {
    if (phase !== "run") return
    if (idx === target) {
      setScore((s) => s + 1)
      setTarget(Math.floor(Math.random() * GRID * GRID))
    } else {
      setScore((s) => Math.max(0, s - 1))
    }
  }

  const cells: Cell[] = Array.from({ length: GRID * GRID }, (_, i) => ({
    id: i,
    target: i === target,
  }))

  return (
    <Panel label="REFLEX GRID // CABINET 01" right={<span>tap the block</span>}>
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_280px]">
        <div className="flex items-center justify-center bg-foreground p-6">
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))` }}>
            {cells.map((c) => (
              <button
                key={c.id}
                onClick={() => onCell(c.id)}
                disabled={phase !== "run"}
                className="relative h-14 w-14 border-2 border-background/40 transition-colors sm:h-16 sm:w-16"
              >
                <AnimatePresence>
                  {c.target && (
                    <motion.span
                      key={`t-${c.id}`}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="absolute inset-1 bg-accent"
                    />
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t-2 border-foreground p-4 lg:border-l-2 lg:border-t-0">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                score
              </div>
              <div className="font-display text-5xl leading-none tracking-widest text-primary">
                {String(score).padStart(3, "0")}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                time
              </div>
              <div className="font-display text-5xl leading-none tracking-widest">
                {String(time).padStart(2, "0")}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest">
            <span className="text-muted-foreground">high score</span>
            <span className="font-display text-xl tracking-widest">
              {String(best).padStart(3, "0")}
            </span>
          </div>

          <div className="mt-auto">
            {phase === "idle" && (
              <button
                onClick={start}
                className="w-full border-2 border-foreground bg-primary py-3 font-display text-2xl tracking-widest text-primary-foreground shadow-[4px_4px_0_0_var(--foreground)] transition-transform hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_var(--foreground)]"
              >
                INSERT COIN
              </button>
            )}
            {phase === "run" && (
              <div className="border-2 border-foreground bg-muted py-3 text-center font-display text-2xl tracking-widest">
                RUNNING
                <span className="blink">...</span>
              </div>
            )}
            {phase === "done" && (
              <div className="flex flex-col gap-2">
                <div className="border-2 border-foreground bg-accent py-3 text-center font-display text-2xl tracking-widest">
                  GAME OVER
                </div>
                <button
                  onClick={start}
                  className="border-2 border-foreground bg-background py-2 font-display text-lg tracking-widest hover:bg-foreground hover:text-background"
                >
                  PLAY AGAIN
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Panel>
  )
}
