"use client"

import { motion } from "motion/react"
import { Panel, Chip } from "@/components/crt/panel"
import { useStore } from "@/lib/store"

type Entry = {
  ts: number
  kind: "MSN" | "FCS"
  label: string
  subject?: string
}

export function HistoryLog() {
  const { missions, focusSessions } = useStore()

  const entries: Entry[] = [
    ...missions
      .filter((m) => m.completed && m.completedAt)
      .map((m) => ({
        ts: m.completedAt!,
        kind: "MSN" as const,
        label: m.title,
        subject: m.subject,
      })),
    ...focusSessions.map((s) => ({
      ts: s.completedAt,
      kind: "FCS" as const,
      label: `${s.minutes}m session${s.subject ? ` // ${s.subject}` : ""}`,
      subject: s.subject,
    })),
  ].sort((a, b) => b.ts - a.ts).slice(0, 40)

  return (
    <Panel label={`HISTORY // LAST ${entries.length}`}>
      <ol className="divide-y divide-border">
        {entries.length === 0 && (
          <li className="px-4 py-8 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            no entries yet // bank your first session
          </li>
        )}
        {entries.map((e, i) => (
          <motion.li
            key={`${e.ts}-${i}`}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(i * 0.015, 0.3) }}
            className="flex items-center gap-3 px-3 py-2"
          >
            <Chip tone={e.kind === "MSN" ? "primary" : "accent"}>{e.kind}</Chip>
            <div className="min-w-0 flex-1 truncate font-mono text-sm">{e.label}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {formatTime(e.ts)}
            </div>
          </motion.li>
        ))}
      </ol>
    </Panel>
  )
}

function formatTime(ts: number) {
  const d = new Date(ts)
  const diff = Date.now() - ts
  const day = 24 * 60 * 60 * 1000
  if (diff < day && d.toDateString() === new Date().toDateString()) {
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" }).toUpperCase()
}
