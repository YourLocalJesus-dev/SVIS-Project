"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { Panel } from "@/components/crt/panel"
import { useStore, getStreak, getTodayStats } from "@/lib/store"

type Line = { kind: "in" | "out" | "sys"; text: string }

const HELP = [
  "available commands:",
  "  help          // show this",
  "  clear         // wipe buffer",
  "  whoami        // identify",
  "  date          // current time",
  "  missions      // jump to missions",
  "  focus [min]   // jump to focus (optional minutes)",
  "  archive       // jump to archive",
  "  arcade        // jump to arcade (if unlocked)",
  "  stats         // today's vitals",
  "  streak        // current streak",
  "  hack          // try your luck",
  "  matrix        // ...",
  "  ascii         // logo",
  "  quote         // random line",
  "  reset         // wipe all local data",
]

const QUOTES = [
  "the machine is you. be kind to it.",
  "memory is a muscle. reps > vibes.",
  "neon fades, habits don't.",
  "stay off the main grid. focus.",
]

const ASCII = `  N   N EEEE OOO N   N
  NN  N E   O   O NN  N
  N N N EEE O   O N N N
  N  NN E   O   O N  NN
  N   N EEEE OOO N   N`

export function MiniTerminal() {
  const router = useRouter()
  const { arcadeUnlocked, unlockArcade, missions, focusSessions, resetAll } = useStore()
  const [lines, setLines] = React.useState<Line[]>([
    { kind: "sys", text: "NEON-DRIVE shell v1.0.86" },
    { kind: "sys", text: "click here or press '/' to focus // type 'help' for commands" },
  ])
  const [value, setValue] = React.useState("")
  const [focused, setFocused] = React.useState(false)
  const endRef = React.useRef<HTMLDivElement | null>(null)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [lines])

  // Global "/" shortcut to jump focus to the terminal from anywhere on the page.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return
      if (e.key === "/") {
        e.preventDefault()
        inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const write = (l: Line | Line[]) =>
    setLines((prev) => [...prev, ...(Array.isArray(l) ? l : [l])])

  const run = (raw: string) => {
    const cmd = raw.trim()
    if (!cmd) return
    write({ kind: "in", text: cmd })
    const [c, ...args] = cmd.toLowerCase().split(/\s+/)

    switch (c) {
      case "help":
        write(HELP.map((t) => ({ kind: "out" as const, text: t })))
        break
      case "clear":
        setLines([])
        break
      case "whoami":
        write({ kind: "out", text: "operator // study.terminal // authenticated" })
        break
      case "date":
        write({ kind: "out", text: new Date().toString() })
        break
      case "missions":
        write({ kind: "out", text: "routing // /missions" })
        setTimeout(() => router.push("/missions"), 300)
        break
      case "focus": {
        const n = Number.parseInt(args[0] ?? "")
        write({
          kind: "out",
          text: `routing // /focus${Number.isFinite(n) && n > 0 ? `?min=${n}` : ""}`,
        })
        setTimeout(
          () => router.push(`/focus${Number.isFinite(n) && n > 0 ? `?min=${n}` : ""}`),
          300,
        )
        break
      }
      case "archive":
        write({ kind: "out", text: "routing // /archive" })
        setTimeout(() => router.push("/archive"), 300)
        break
      case "arcade":
        if (arcadeUnlocked) {
          write({ kind: "out", text: "routing // /arcade" })
          setTimeout(() => router.push("/arcade"), 300)
        } else {
          write({ kind: "out", text: "ACCESS DENIED. hint: ↑↑↓↓←→←→ B A" })
        }
        break
      case "stats": {
        const { completedToday, focusToday, openMissions } = getTodayStats(missions, focusSessions)
        write([
          { kind: "out", text: `open.missions    ${openMissions}` },
          { kind: "out", text: `completed.today  ${completedToday}` },
          { kind: "out", text: `focus.today      ${focusToday}m` },
        ])
        break
      }
      case "streak":
        write({ kind: "out", text: `current.streak = ${getStreak(focusSessions)}d` })
        break
      case "hack":
        write([
          { kind: "out", text: "initiating // [███░░░░░░░] 30%" },
          { kind: "out", text: "initiating // [████████░░] 80%" },
          { kind: "out", text: "jk. go hack your homework instead." },
        ])
        break
      case "matrix":
        if (!arcadeUnlocked) unlockArcade()
        write([
          { kind: "out", text: "follow the white rabbit..." },
          { kind: "out", text: "arcade cabinet powered on. /arcade" },
        ])
        break
      case "ascii":
        ASCII.split("\n").forEach((t) => write({ kind: "out", text: t }))
        break
      case "quote":
        write({ kind: "out", text: QUOTES[Math.floor(Math.random() * QUOTES.length)] })
        break
      case "reset":
        resetAll()
        write({ kind: "out", text: "local.store // wiped. fresh boot loaded." })
        break
      default:
        write({ kind: "out", text: `unknown command: ${c}. try 'help'.` })
    }
  }

  const historyRef = React.useRef<string[]>([])
  const historyIdxRef = React.useRef<number>(-1)

  const submit = () => {
    const v = value
    if (!v.trim()) return
    historyRef.current = [v, ...historyRef.current].slice(0, 50)
    historyIdxRef.current = -1
    run(v)
    setValue("")
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      e.stopPropagation()
      submit()
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      const next = Math.min(historyIdxRef.current + 1, historyRef.current.length - 1)
      if (next >= 0) {
        historyIdxRef.current = next
        setValue(historyRef.current[next] ?? "")
      }
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      const next = Math.max(historyIdxRef.current - 1, -1)
      historyIdxRef.current = next
      setValue(next === -1 ? "" : historyRef.current[next] ?? "")
      return
    }
  }

  return (
    <Panel
      label="SHELL // /dev/operator"
      right={<span>press &apos;/&apos; to focus // type &apos;help&apos;</span>}
    >
      <div
        className="flex h-72 flex-col bg-foreground text-background"
        onClick={() => inputRef.current?.focus()}
        role="presentation"
      >
        <div className="flex-1 overflow-y-auto p-3 font-mono text-[12px] leading-snug">
          <AnimatePresence initial={false}>
            {lines.map((l, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="whitespace-pre-wrap"
              >
                {l.kind === "in" && <span className="text-accent">{"> "}{l.text}</span>}
                {l.kind === "out" && <span>{l.text}</span>}
                {l.kind === "sys" && <span className="text-accent/80">{"// "}{l.text}</span>}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={endRef} />
        </div>
        <div className="flex items-center gap-2 border-t-2 border-accent/30 bg-foreground px-3 py-2 font-mono text-[13px]">
          <span className="text-accent">{focused ? ">" : "$"}</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex-1 bg-transparent text-background caret-accent outline-none placeholder:text-background/50"
            style={{ caretColor: "var(--accent)" }}
            placeholder={focused ? "command... (try 'help')" : "click here to type"}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="terminal input"
            type="text"
          />
          <span className="blink text-accent">▌</span>
        </div>
      </div>
    </Panel>
  )
}
