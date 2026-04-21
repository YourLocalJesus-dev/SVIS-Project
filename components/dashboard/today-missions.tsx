"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { useStore, type Priority } from "@/lib/store"
import { Panel, Chip } from "@/components/crt/panel"
import { Check, ArrowUpRight } from "lucide-react"

const PRIORITY_LABEL: Record<Priority, string> = {
  low: "LOW",
  med: "MED",
  high: "HIGH",
  critical: "CRIT",
}
const PRIORITY_TONE: Record<Priority, "muted" | "default" | "accent" | "primary"> = {
  low: "muted",
  med: "default",
  high: "accent",
  critical: "primary",
}

export function TodayMissions() {
  const { missions, toggleMission } = useStore()
  const open = missions.filter((m) => !m.completed).slice(0, 5)

  return (
    <Panel
      label="TODAY // PRIORITY QUEUE"
      right={
        <Link
          href="/missions"
          className="inline-flex items-center gap-1 hover:text-accent"
        >
          ALL MSN <ArrowUpRight className="h-3 w-3" />
        </Link>
      }
    >
      <ul className="divide-y divide-border">
        <AnimatePresence initial={false}>
          {open.length === 0 && (
            <li className="px-4 py-8 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
              queue clear. the grid salutes you.
            </li>
          )}
          {open.map((m, idx) => (
            <motion.li
              key={m.id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ delay: idx * 0.04 }}
              className="flex items-center gap-3 px-3 py-2"
            >
              <button
                onClick={() => toggleMission(m.id)}
                className="flex h-5 w-5 flex-shrink-0 items-center justify-center border-2 border-foreground transition-colors hover:bg-accent"
                aria-label="Complete mission"
              >
                {m.completed && <Check className="h-3 w-3" />}
              </button>
              <div className="min-w-0 flex-1">
                <div className="truncate font-mono text-sm">{m.title}</div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <Chip tone="muted">{m.subject}</Chip>
                  <Chip tone={PRIORITY_TONE[m.priority]}>{PRIORITY_LABEL[m.priority]}</Chip>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Panel>
  )
}
