"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Panel } from "@/components/crt/panel"
import { Target, Timer, Archive, Gamepad2 } from "lucide-react"
import { useStore } from "@/lib/store"

export function Shortcuts() {
  const { arcadeUnlocked } = useStore()
  const items = [
    { href: "/missions", label: "LOG MISSION", icon: Target, note: "F1" },
    { href: "/focus", label: "START FOCUS", icon: Timer, note: "F2" },
    { href: "/archive", label: "OPEN ARCHIVE", icon: Archive, note: "F3" },
    arcadeUnlocked
      ? { href: "/arcade", label: "ENTER ARCADE", icon: Gamepad2, note: "★" }
      : { href: "/missions#help", label: "???", icon: Gamepad2, note: "LOCK" },
  ]

  return (
    <Panel label="SHORTCUTS">
      <div className="grid grid-cols-2 gap-0">
        {items.map((it, i) => {
          const Icon = it.icon
          const locked = it.label === "???"
          return (
            <motion.div
              key={i}
              whileHover={{ scale: locked ? 1 : 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b" : ""} border-border`}
            >
              <Link
                href={it.href}
                aria-disabled={locked}
                className={`flex h-full items-center justify-between gap-2 px-3 py-4 font-display text-xl tracking-widest transition-colors ${
                  locked
                    ? "text-muted-foreground"
                    : "hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {it.label}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">
                  {it.note}
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </Panel>
  )
}
