"use client"

import * as React from "react"
import { useStore } from "@/lib/store"

const KONAMI = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
]

const SECRET_WORDS = ["hack", "matrix", "arcade", "run"]

export function KonamiListener() {
  const { unlockArcade, arcadeUnlocked } = useStore()
  const bufferRef = React.useRef<string[]>([])
  const wordRef = React.useRef("")

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing in inputs.
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return

      // Konami code
      bufferRef.current = [...bufferRef.current, e.key].slice(-KONAMI.length)
      if (bufferRef.current.join(",") === KONAMI.join(",")) {
        if (!arcadeUnlocked) {
          unlockArcade()
          window.dispatchEvent(
            new CustomEvent("neon-toast", {
              detail: {
                title: "ACCESS GRANTED",
                body: "//ARCADE// unlocked — check the nav",
              },
            }),
          )
        } else {
          window.dispatchEvent(
            new CustomEvent("neon-toast", {
              detail: { title: "ALREADY UNLOCKED", body: "the grid remembers you, operator" },
            }),
          )
        }
      }

      // Secret word typing (any typed letters over 1s window)
      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        wordRef.current = (wordRef.current + e.key).toLowerCase().slice(-10)
        for (const w of SECRET_WORDS) {
          if (wordRef.current.endsWith(w)) {
            wordRef.current = ""
            window.dispatchEvent(
              new CustomEvent("neon-toast", {
                detail: {
                  title: `CMD: ${w.toUpperCase()}`,
                  body:
                    w === "run"
                      ? "go fast. don't look back."
                      : w === "matrix"
                        ? "there is no spoon, only substitution."
                        : w === "arcade"
                          ? arcadeUnlocked
                            ? "cabinet already online"
                            : "try the konami code ↑↑↓↓←→←→ B A"
                          : "nothing personal. just practice.",
                },
              }),
            )
          }
        }
      }

      if (e.key === "?") {
        window.dispatchEvent(
          new CustomEvent("neon-toast", {
            detail: {
              title: "HINT",
              body:
                "try: konami code, logo×5, typing 'run' or 'matrix', and the terminal on the dashboard",
            },
          }),
        )
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [arcadeUnlocked, unlockArcade])

  return null
}
