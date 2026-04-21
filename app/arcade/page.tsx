"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { PageTitle } from "@/components/crt/panel"
import { ReflexGrid } from "@/components/arcade/reflex-grid"
import { useStore } from "@/lib/store"

export default function ArcadePage() {
  const { arcadeUnlocked, hydrated } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (hydrated && !arcadeUnlocked) router.replace("/")
  }, [hydrated, arcadeUnlocked, router])

  if (!hydrated || !arcadeUnlocked) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="font-display text-4xl tracking-widest text-primary">ACCESS DENIED</div>
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          this route requires clearance // try the konami code
        </div>
        <Link
          href="/"
          className="border-2 border-foreground px-4 py-2 font-display tracking-widest hover:bg-foreground hover:text-background"
        >
          RETURN
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        chip="ROUTE // /arcade (classified)"
        title="THE CABINET"
        sub="reward for the curious. 30 seconds, 25 tiles, one target. chase the high score."
      />
      <ReflexGrid />
      <div className="text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        congratulations, operator. the grid remembers you.
      </div>
    </div>
  )
}
