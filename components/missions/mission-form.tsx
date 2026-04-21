"use client"

import * as React from "react"
import { Panel } from "@/components/crt/panel"
import { useStore, PRIORITIES, SUBJECTS, type Priority, type Subject } from "@/lib/store"

export function MissionForm() {
  const { addMission } = useStore()
  const [title, setTitle] = React.useState("")
  const [subject, setSubject] = React.useState<Subject>("MATH")
  const [priority, setPriority] = React.useState<Priority>("med")
  const [notes, setNotes] = React.useState("")

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addMission({ title: title.trim(), subject, priority, notes: notes.trim() || undefined })
    setTitle("")
    setNotes("")
    window.dispatchEvent(
      new CustomEvent("neon-toast", {
        detail: { title: "MISSION LOGGED", body: `${subject} // ${priority.toUpperCase()}` },
      }),
    )
  }

  return (
    <Panel label="NEW MISSION // INPUT" accent>
      <form onSubmit={submit} className="flex flex-col gap-3 p-4">
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="read ch.7 // solve problem set..."
            className="w-full border-2 border-foreground bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
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
              priority
            </label>
            <div className="flex gap-0">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 border-2 px-1 py-2 font-display text-sm tracking-widest transition-colors ${
                    p === priority
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/40 bg-background hover:bg-muted"
                  } ${p !== "low" ? "border-l-0" : ""}`}
                >
                  {p.toUpperCase().slice(0, 4)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            notes // optional
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="intel / attack plan..."
            className="w-full resize-none border-2 border-foreground bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={!title.trim()}
          className="border-2 border-foreground bg-primary px-4 py-2 font-display text-2xl tracking-widest text-primary-foreground shadow-[4px_4px_0_0_var(--foreground)] transition-all hover:-translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_var(--foreground)] active:translate-x-0 active:translate-y-0 active:shadow-[0_0_0_0_var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          [ LOG MISSION ]
        </button>
      </form>
    </Panel>
  )
}
