"use client"

import { motion } from "motion/react"
import { useStore, getStreak } from "@/lib/store"

export function StatCards() {
  const { missions, focusSessions } = useStore()
  const totalMinutes = focusSessions.reduce((a, s) => a + s.minutes, 0)
  const completedMissions = missions.filter((m) => m.completed).length
  const streak = getStreak(focusSessions)
  const sessions = focusSessions.length

  const cards = [
    { label: "TOTAL FOCUS", value: formatMinutes(totalMinutes), note: "all-time" },
    { label: "SESSIONS", value: String(sessions), note: "pomodoros banked" },
    { label: "COMPLETED MSN", value: String(completedMissions), note: "hunted & done" },
    { label: "STREAK", value: `${streak}d`, note: "consecutive days" },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bracket-frame border-2 border-foreground bg-card p-3 shadow-[4px_4px_0_0_var(--foreground)]"
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {c.label}
          </div>
          <div className="mt-1 font-display text-4xl leading-none tracking-widest text-primary">
            {c.value}
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {c.note}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function formatMinutes(m: number) {
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  const mm = m % 60
  return `${h}h${mm > 0 ? mm + "m" : ""}`
}
