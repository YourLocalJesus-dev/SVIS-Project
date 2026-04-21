"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { Panel } from "@/components/crt/panel"
import { useStore, SUBJECTS, type Subject } from "@/lib/store"
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react"

type Mode = "work" | "short" | "long"
const DEFAULT_DURATIONS: Record<Mode, number> = { work: 25, short: 5, long: 15 }

export function FocusTimer() {
  const params = useSearchParams()
  const overrideMin = Number.parseInt(params.get("min") ?? "")
  const missionParam = params.get("mission")

  const { missions, addFocusSession } = useStore()
  const openMissions = missions.filter((m) => !m.completed)

  const [mode, setMode] = React.useState<Mode>("work")
  const [durations, setDurations] = React.useState<Record<Mode, number>>(
    Number.isFinite(overrideMin) && overrideMin > 0
      ? { ...DEFAULT_DURATIONS, work: overrideMin }
      : DEFAULT_DURATIONS,
  )
  const [remaining, setRemaining] = React.useState(durations[mode] * 60)
  const [running, setRunning] = React.useState(false)
  const [subject, setSubject] = React.useState<Subject>("MATH")
  const [missionId, setMissionId] = React.useState<string>(missionParam ?? "")
  const [cycle, setCycle] = React.useState(0) // how many work sessions completed

  // Reset remaining when mode or durations change (but not while running)
  React.useEffect(() => {
    if (!running) setRemaining(durations[mode] * 60)
  }, [mode, durations, running])

  // Tick
  React.useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [running])

  // On zero
  const completedRef = React.useRef(false)
  React.useEffect(() => {
    if (remaining === 0 && running && !completedRef.current) {
      completedRef.current = true
      setRunning(false)
      if (mode === "work") {
        addFocusSession({
          minutes: durations.work,
          subject,
          missionId: missionId || undefined,
        })
        setCycle((c) => c + 1)
        const nextMode: Mode = (cycle + 1) % 4 === 0 ? "long" : "short"
        window.dispatchEvent(
          new CustomEvent("neon-toast", {
            detail: {
              title: "SESSION COMPLETE",
              body: `+${durations.work}m banked // breathe. ${nextMode === "long" ? "long break" : "short break"} loaded`,
            },
          }),
        )
        setMode(nextMode)
      } else {
        window.dispatchEvent(
          new CustomEvent("neon-toast", {
            detail: { title: "BREAK OVER", body: "back to the grid, operator" },
          }),
        )
        setMode("work")
      }
    }
    if (remaining > 0) completedRef.current = false
  }, [remaining, running, mode, durations, subject, missionId, cycle, addFocusSession])

  const total = durations[mode] * 60
  const progress = 1 - remaining / total
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0")
  const ss = String(remaining % 60).padStart(2, "0")

  const reset = () => {
    setRunning(false)
    setRemaining(durations[mode] * 60)
  }
  const skip = () => {
    setRunning(false)
    if (mode === "work") {
      const nextMode: Mode = (cycle + 1) % 4 === 0 ? "long" : "short"
      setMode(nextMode)
    } else {
      setMode("work")
    }
  }

  return (
    <Panel label={`PROTOCOL // ${mode.toUpperCase()}`} right={<span>cycle {cycle}</span>}>
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_320px]">
        {/* Timer face */}
        <div className="relative flex flex-col items-center justify-center gap-6 bg-foreground px-6 py-10 text-background">
          <RingProgress progress={progress} />

          <AnimatePresence mode="wait">
            <motion.div
              key={`${mm}:${ss}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.14 }}
              className="absolute flex items-baseline font-display text-[104px] leading-none tracking-widest text-accent sm:text-[140px]"
            >
              <span>{mm}</span>
              <span className={running ? "blink" : ""}>:</span>
              <span>{ss}</span>
            </motion.div>
          </AnimatePresence>

          <div className="z-10 mt-[180px] flex items-center gap-2 sm:mt-[240px]">
            <button
              onClick={() => setRunning((r) => !r)}
              className="flex items-center gap-2 border-2 border-accent bg-accent px-5 py-2 font-display text-2xl tracking-widest text-foreground shadow-[4px_4px_0_0_var(--accent)] transition-transform hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_var(--accent)]"
            >
              {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              {running ? "PAUSE" : "RUN"}
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 border-2 border-background bg-transparent px-3 py-2 font-display text-lg tracking-widest hover:bg-background hover:text-foreground"
              aria-label="Reset"
            >
              <RotateCcw className="h-4 w-4" />
              RST
            </button>
            <button
              onClick={skip}
              className="flex items-center gap-1.5 border-2 border-background bg-transparent px-3 py-2 font-display text-lg tracking-widest hover:bg-background hover:text-foreground"
              aria-label="Skip"
            >
              <SkipForward className="h-4 w-4" />
              SKP
            </button>
          </div>
        </div>

        {/* Sidebar controls */}
        <div className="flex flex-col gap-4 border-t-2 border-foreground p-4 lg:border-l-2 lg:border-t-0">
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              mode
            </label>
            <div className="flex">
              {(["work", "short", "long"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m)
                    setRunning(false)
                  }}
                  className={`flex-1 border-2 px-2 py-2 font-display text-sm tracking-widest transition-colors ${
                    m === mode
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/40 bg-background hover:bg-muted"
                  } ${m !== "work" ? "border-l-0" : ""}`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              duration // min
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["work", "short", "long"] as Mode[]).map((m) => (
                <div key={m} className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase text-muted-foreground">
                    {m}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={durations[m]}
                    onChange={(e) => {
                      const v = Math.max(1, Math.min(180, Number.parseInt(e.target.value) || 1))
                      setDurations((d) => ({ ...d, [m]: v }))
                    }}
                    className="border-2 border-foreground bg-background px-2 py-1 font-mono text-sm outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="w-full border-2 border-foreground bg-background px-2 py-2 font-mono text-sm outline-none focus:border-primary"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              link mission // optional
            </label>
            <select
              value={missionId}
              onChange={(e) => setMissionId(e.target.value)}
              className="w-full border-2 border-foreground bg-background px-2 py-2 font-mono text-xs outline-none focus:border-primary"
            >
              <option value="">— none —</option>
              {openMissions.map((m) => (
                <option key={m.id} value={m.id}>
                  [{m.subject}] {m.title.slice(0, 50)}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-auto border-t-2 border-border pt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            // tip: try the terminal — <span className="text-foreground">focus 50</span> on the
            dashboard
          </div>
        </div>
      </div>
    </Panel>
  )
}

function RingProgress({ progress }: { progress: number }) {
  const size = 340
  const stroke = 6
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = c * (1 - progress)
  return (
    <svg
      width={size}
      height={size}
      className="absolute"
      style={{ transform: "rotate(-90deg)" }}
      aria-hidden
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="currentColor"
        strokeOpacity={0.2}
        strokeWidth={stroke}
        fill="none"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="var(--accent)"
        strokeWidth={stroke}
        strokeLinecap="square"
        fill="none"
        strokeDasharray={c}
        animate={{ strokeDashoffset: dash }}
        transition={{ duration: 0.4, ease: "linear" }}
        strokeDashoffset={dash}
      />
      {/* tick marks */}
      {Array.from({ length: 60 }).map((_, i) => {
        const a = (i / 60) * Math.PI * 2
        const x1 = size / 2 + Math.cos(a) * (r - 12)
        const y1 = size / 2 + Math.sin(a) * (r - 12)
        const x2 = size / 2 + Math.cos(a) * (r - 18)
        const y2 = size / 2 + Math.sin(a) * (r - 18)
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeOpacity={i % 5 === 0 ? 0.6 : 0.2}
            strokeWidth={i % 5 === 0 ? 2 : 1}
          />
        )
      })}
    </svg>
  )
}
