import { PageTitle } from "@/components/crt/panel"
import { StatCards } from "@/components/archive/stat-cards"
import { FocusChart, SubjectBreakdown } from "@/components/archive/focus-chart"
import { Achievements } from "@/components/archive/achievements"
import { HistoryLog } from "@/components/archive/history-log"

export default function ArchivePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        chip="ROUTE // /archive"
        title="DATA ARCHIVE"
        sub="the ghost in the machine remembers everything. review your numbers, collect trophies, read the tape."
      />

      <StatCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <FocusChart />
        <SubjectBreakdown />
      </div>

      <Achievements />

      <HistoryLog />
    </div>
  )
}
