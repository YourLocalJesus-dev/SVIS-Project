"use client"

import * as React from "react"

/* ============================================================
   NEON-DRIVE store
   A tiny typed client-side store persisted to localStorage.
   Holds missions, completed focus sessions, and meta toggles
   (CRT mode, arcade unlock, boot sequence seen).
   ============================================================ */

export type Priority = "low" | "med" | "high" | "critical"
export type Subject =
  | "MATH"
  | "SCI"
  | "HIST"
  | "CODE"
  | "LANG"
  | "ART"
  | "LIT"
  | "MISC"

export const SUBJECTS: Subject[] = ["MATH", "SCI", "HIST", "CODE", "LANG", "ART", "LIT", "MISC"]
export const PRIORITIES: Priority[] = ["low", "med", "high", "critical"]

export type Mission = {
  id: string
  title: string
  subject: Subject
  priority: Priority
  completed: boolean
  createdAt: number
  completedAt?: number
  notes?: string
}

export type FocusSession = {
  id: string
  minutes: number
  completedAt: number
  missionId?: string
  subject?: Subject
}

type State = {
  missions: Mission[]
  focusSessions: FocusSession[]
  crtMode: boolean
  arcadeUnlocked: boolean
  bootSeen: boolean
  hydrated: boolean
}

type Ctx = State & {
  addMission: (m: { title: string; subject: Subject; priority: Priority; notes?: string }) => void
  toggleMission: (id: string) => void
  deleteMission: (id: string) => void
  updateMission: (id: string, patch: Partial<Mission>) => void
  addFocusSession: (s: { minutes: number; missionId?: string; subject?: Subject }) => void
  toggleCRT: () => void
  unlockArcade: () => void
  markBootSeen: () => void
  resetAll: () => void
}

const StoreContext = React.createContext<Ctx | null>(null)

const LS_KEY = "neon-drive:state:v1"

const defaultState: State = {
  missions: [],
  focusSessions: [],
  crtMode: true,
  arcadeUnlocked: false,
  bootSeen: false,
  hydrated: false,
}

const seed = (): Mission[] => [
  {
    id: "m-demo-1",
    title: "Calc II — Ch. 7 integrals",
    subject: "MATH",
    priority: "high",
    completed: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
    notes: "Focus on u-substitution",
  },
  {
    id: "m-demo-2",
    title: "Read Gibson // Neuromancer",
    subject: "LIT",
    priority: "med",
    completed: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 10,
  },
  {
    id: "m-demo-3",
    title: "Ship assignment // Data Structures",
    subject: "CODE",
    priority: "critical",
    completed: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    completedAt: Date.now() - 1000 * 60 * 60 * 4,
  },
  {
    id: "m-demo-4",
    title: "History — Cold War essay draft",
    subject: "HIST",
    priority: "med",
    completed: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
  },
]

const seedSessions = (): FocusSession[] => {
  const now = Date.now()
  const sessions: FocusSession[] = []
  for (let i = 0; i < 14; i++) {
    const dayAgo = now - i * 24 * 60 * 60 * 1000
    const count = Math.floor(Math.random() * 4)
    for (let j = 0; j < count; j++) {
      sessions.push({
        id: `s-seed-${i}-${j}`,
        minutes: 25,
        completedAt: dayAgo - j * 60 * 60 * 1000,
        subject: SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)],
      })
    }
  }
  return sessions
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<State>(defaultState)

  // Hydrate from localStorage once.
  React.useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(LS_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>
        setState((s) => ({ ...s, ...parsed, hydrated: true }))
      } else {
        // First ever visit — seed with demo missions + fake focus history
        setState({
          ...defaultState,
          missions: seed(),
          focusSessions: seedSessions(),
          hydrated: true,
        })
      }
    } catch {
      setState((s) => ({ ...s, hydrated: true }))
    }
  }, [])

  // Persist.
  React.useEffect(() => {
    if (!state.hydrated) return
    try {
      const { hydrated: _h, ...toSave } = state
      window.localStorage.setItem(LS_KEY, JSON.stringify(toSave))
    } catch {
      /* ignore quota errors */
    }
  }, [state])

  const api = React.useMemo<Ctx>(
    () => ({
      ...state,
      addMission: ({ title, subject, priority, notes }) =>
        setState((s) => ({
          ...s,
          missions: [
            {
              id: `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
              title,
              subject,
              priority,
              notes,
              completed: false,
              createdAt: Date.now(),
            },
            ...s.missions,
          ],
        })),
      toggleMission: (id) =>
        setState((s) => ({
          ...s,
          missions: s.missions.map((m) =>
            m.id === id
              ? {
                  ...m,
                  completed: !m.completed,
                  completedAt: !m.completed ? Date.now() : undefined,
                }
              : m,
          ),
        })),
      deleteMission: (id) =>
        setState((s) => ({ ...s, missions: s.missions.filter((m) => m.id !== id) })),
      updateMission: (id, patch) =>
        setState((s) => ({
          ...s,
          missions: s.missions.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),
      addFocusSession: ({ minutes, missionId, subject }) =>
        setState((s) => ({
          ...s,
          focusSessions: [
            {
              id: `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
              minutes,
              missionId,
              subject,
              completedAt: Date.now(),
            },
            ...s.focusSessions,
          ],
        })),
      toggleCRT: () => setState((s) => ({ ...s, crtMode: !s.crtMode })),
      unlockArcade: () => setState((s) => ({ ...s, arcadeUnlocked: true })),
      markBootSeen: () => setState((s) => ({ ...s, bootSeen: true })),
      resetAll: () =>
        setState({
          ...defaultState,
          missions: seed(),
          focusSessions: seedSessions(),
          hydrated: true,
        }),
    }),
    [state],
  )

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = React.useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>")
  return ctx
}

/* ============================================================
   Derived selectors (pure helpers)
   ============================================================ */

export function getStreak(sessions: FocusSession[]): number {
  if (sessions.length === 0) return 0
  const days = new Set(
    sessions.map((s) => new Date(s.completedAt).toDateString()),
  )
  let streak = 0
  const cursor = new Date()
  while (days.has(cursor.toDateString())) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function getTodayStats(missions: Mission[], sessions: FocusSession[]) {
  const today = new Date().toDateString()
  const completedToday = missions.filter(
    (m) => m.completed && m.completedAt && new Date(m.completedAt).toDateString() === today,
  ).length
  const focusToday = sessions
    .filter((s) => new Date(s.completedAt).toDateString() === today)
    .reduce((acc, s) => acc + s.minutes, 0)
  const openMissions = missions.filter((m) => !m.completed).length
  return { completedToday, focusToday, openMissions }
}

export function getLast7Days(sessions: FocusSession[]) {
  const out: { label: string; minutes: number; date: string }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toDateString()
    const minutes = sessions
      .filter((s) => new Date(s.completedAt).toDateString() === key)
      .reduce((acc, s) => acc + s.minutes, 0)
    out.push({
      label: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      date: key,
      minutes,
    })
  }
  return out
}
