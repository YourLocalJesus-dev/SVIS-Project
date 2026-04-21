"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Panel, Chip } from "@/components/crt/panel"
import { useStore, type Priority, type Subject, SUBJECTS } from "@/lib/store"
import { Check, Trash2 } from "lucide-react"

const PRIORITY_ORDER: Record<Priority, number> = { critical: 0, high: 1, med: 2, low: 3 }
const PRIORITY_TONE: Record<Priority, "muted" | "default" | "accent" | "primary"> = {
  low: "muted",
  med: "default",
  high: "accent",
  critical: "primary",
}

type Filter = "ALL" | "OPEN" | "DONE" | Subject

export function MissionList() {
  const { missions, toggleMission, deleteMission } = useStore()
  const [filter, setFilter] = React.useState<Filter>("OPEN")
  const [query, setQuery] = React.useState("")

  const filtered = React.useMemo(() => {
    let list = [...missions]
    if (filter === "OPEN") list = list.filter((m) => !m.completed)
    else if (filter === "DONE") list = list.filter((m) => m.completed)
    else if (filter !== "ALL") list = list.filter((m) => m.subject === filter)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (m) => m.title.toLowerCase().includes(q) || m.notes?.toLowerCase().includes(q),
      )
    }
    list.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      if (a.completed) return (b.completedAt ?? 0) - (a.completedAt ?? 0)
      const p = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      if (p !== 0) return p
      return b.createdAt - a.createdAt
    })
    return list
  }, [missions, filter, query])

  const tabs: Filter[] = ["OPEN", "DONE", "ALL", ...SUBJECTS]

  return (
    <Panel
      label={`MISSIONS // ${filtered.length.toString().padStart(2, "0")}`}
      right={<span>sort // priority → time</span>}
    >
      <div className="border-b-2 border-foreground">
        <div className="flex flex-wrap items-center gap-2 p-3">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                filter === t
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              {t}
            </button>
          ))}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="// search"
            className="ml-auto w-full max-w-[220px] border border-foreground bg-background px-2 py-1 font-mono text-xs outline-none focus:border-primary"
          />
        </div>
      </div>

      <ul className="divide-y divide-border">
        <AnimatePresence initial={false}>
          {filtered.length === 0 && (
            <motion.li
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-12 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground"
            >
              no signal // adjust your filters
            </motion.li>
          )}
          {filtered.map((m, idx) => (
            <motion.li
              key={m.id}
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ delay: Math.min(idx * 0.02, 0.2) }}
              className={`group flex items-start gap-3 px-3 py-3 ${
                m.completed ? "bg-muted/40" : ""
              }`}
            >
              <button
                onClick={() => toggleMission(m.id)}
                className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center border-2 border-foreground transition-colors hover:bg-accent"
                aria-label="Toggle complete"
              >
                {m.completed && <Check className="h-3 w-3" />}
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <div
                    className={`font-mono text-sm ${
                      m.completed ? "text-muted-foreground line-through" : ""
                    }`}
                  >
                    {m.title}
                  </div>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <Chip tone="muted">{m.subject}</Chip>
                  <Chip tone={PRIORITY_TONE[m.priority]}>{m.priority.toUpperCase()}</Chip>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {relTime(m.createdAt)}
                  </span>
                </div>
                {m.notes && (
                  <div className="mt-1 border-l-2 border-border pl-2 font-mono text-xs text-muted-foreground">
                    {m.notes}
                  </div>
                )}
              </div>
              <button
                onClick={() => deleteMission(m.id)}
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center border border-transparent text-muted-foreground transition-colors hover:border-foreground hover:bg-destructive hover:text-destructive-foreground"
                aria-label="Delete mission"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Panel>
  )
}

function relTime(ts: number) {
  const diff = Date.now() - ts
  const m = Math.round(diff / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  return `${d}d ago`
}
