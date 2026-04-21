import { Suspense } from "react"
import { PageTitle } from "@/components/crt/panel"
import { FocusTimer } from "@/components/focus/focus-timer"

export default function FocusPage() {
  return (
    <div>
      <PageTitle
        chip="ROUTE // /focus"
        title="FOCUS PROTOCOL"
        sub="engage the ring. 25-minute bursts, short break, long break every 4 cycles. classic."
      />
      <Suspense fallback={<div className="font-mono text-xs text-muted-foreground">booting timer...</div>}>
        <FocusTimer />
      </Suspense>
    </div>
  )
}
