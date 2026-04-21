"use client"

import { motion } from "motion/react"
import { Panel } from "@/components/crt/panel"
import { useStore, getLast7Days, SUBJECTS } from "@/lib/store"

export function FocusChart() {
  const { focusSessions } = useStore()
  const days = getLast7Days(focusSessions)
  const max = Math.max(60, ...days.map((d) => d.minutes))

  return (
    <Panel label="FOCUS // 7-DAY TELEMETRY">
      <div className="p-4">
        <div className="flex items-end gap-2" style={{ height: 180 }}>
          {days.map((d, i) => {
            const h = (d.minutes / max) * 100
            return (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative flex w-full flex-1 flex-col justify-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(2, h)}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                    className="w-full border-2 border-foreground"
                    style={{
                      background: d.minutes === 0 ? "var(--muted)" : "var(--primary)",
                    }}
                  />
                  {d.minutes > 0 && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest">
                      {d.minutes}
                    </div>
                  )}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {d.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Panel>
  )
}

export function SubjectBreakdown() {
  const { focusSessions } = useStore()
  const buckets = SUBJECTS.map((s) => ({
    subject: s,
    minutes: focusSessions.filter((x) => x.subject === s).reduce((a, x) => a + x.minutes, 0),
  }))
    .filter((b) => b.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)

  const total = buckets.reduce((a, b) => a + b.minutes, 0) || 1

  return (
    <Panel label="SUBJECT // BREAKDOWN">
      <div className="flex flex-col gap-2 p-4">
        {buckets.length === 0 && (
          <div className="py-6 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            no data yet. log a focus session.
          </div>
        )}
        {buckets.map((b, i) => {
          const pct = (b.minutes / total) * 100
          return (
            <div key={b.subject}>
              <div className="mb-1 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-widest">
                <span>{b.subject}</span>
                <span className="text-muted-foreground">
                  {b.minutes}m // {pct.toFixed(0)}%
                </span>
              </div>
              <div className="h-3 border border-foreground">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                  className="h-full"
                  style={{
                    background:
                      i % 3 === 0 ? "var(--primary)" : i % 3 === 1 ? "var(--accent)" : "var(--secondary)",
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
