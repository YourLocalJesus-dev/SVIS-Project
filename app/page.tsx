import { HeroTerminal } from "@/components/dashboard/hero-terminal"
import { TodayMissions } from "@/components/dashboard/today-missions"
import { SystemWidget } from "@/components/dashboard/system-widget"
import { MiniTerminal } from "@/components/dashboard/mini-terminal"
import { Shortcuts } from "@/components/dashboard/shortcuts"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <HeroTerminal />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <TodayMissions />
          <Shortcuts />
        </div>
        <div className="flex flex-col gap-6">
          <SystemWidget />
        </div>
      </div>

      <MiniTerminal />
    </div>
  )
}
