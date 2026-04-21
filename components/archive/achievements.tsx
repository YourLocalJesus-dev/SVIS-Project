"use client"

import { motion } from "motion/react"
import { Panel } from "@/components/crt/panel"
import { useStore, getStreak } from "@/lib/store"

type Achievement = {
  id: string
  name: string
  desc: string
  check: (ctx: { totalMin: number; sessions: number; streak: number; completed: number; arcade: boolean }) => boolean
}

const LIST: Achievement[] = [
  { id: "first-blood", name: "FIRST BLOOD", desc: "complete 1 mission", check: (c) => c.completed >= 1 },
  { id: "ten-done", name: "X DONE", desc: "10 missions completed", check: (c) => c.completed >= 10 },
  { id: "first-focus", name: "LOCKED IN", desc: "complete 1 focus session", check: (c) => c.sessions >= 1 },
  { id: "hour-club", name: "HOUR CLUB", desc: "60m of total focus", check: (c) => c.totalMin >= 60 },
  { id: "deep-diver", name: "DEEP DIVER", desc: "5h total focus", check: (c) => c.totalMin >= 300 },
  { id: "streak-3", name: "GRID RUNNER", desc: "3-day streak", check: (c) => c.streak >= 3 },
  { id: "streak-7", name: "NEON WEEK", desc: "7-day streak", check: (c) => c.streak >= 7 },
  { id: "arcade", name: "SECRET CABINET", desc: "unlock the arcade", check: (c) => c.arcade },
]

export function Achievements() {
  const { missions, focusSessions, arcadeUnlocked } = useStore()
  const ctx = {
    totalMin: focusSessions.reduce((a, s) => a + s.minutes, 0),
    sessions: focusSessions.length,
    streak: getStreak(focusSessions),
    completed: missions.filter((m) => m.completed).length,
    arcade: arcadeUnlocked,
  }

  const unlocked = LIST.filter((a) => a.check(ctx)).length

  return (
    <Panel label={`TROPHIES // ${unlocked}/${LIST.length}`}>
      <div className="grid grid-cols-2 gap-0 sm:grid-cols-4">
        {LIST.map((a, i) => {
          const got = a.check(ctx)
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`relative flex aspect-square flex-col items-center justify-center gap-1 border-b border-r border-border p-3 text-center ${
                got ? "bg-background" : "bg-muted/50 text-muted-foreground"
              }`}
            >
              <div
                className={`mb-1 flex h-10 w-10 items-center justify-center border-2 font-display text-xl ${
                  got ? "border-foreground bg-accent text-foreground" : "border-border bg-background"
                }`}
              >
                {got ? "★" : "?"}
              </div>
              <div className="font-display text-sm tracking-widest">{a.name}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {got ? a.desc : "locked"}
              </div>
            </motion.div>
          )
        })}
      </div>
    </Panel>
  )
}
