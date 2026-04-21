import { PageTitle } from "@/components/crt/panel"
import { MissionForm } from "@/components/missions/mission-form"
import { MissionList } from "@/components/missions/mission-list"

export default function MissionsPage() {
  return (
    <div>
      <PageTitle
        chip="ROUTE // /missions"
        title="MISSION LOG"
        sub="log what needs doing. prioritize it. hunt it down. the queue clears itself.not."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <MissionForm />
        </div>
        <MissionList />
      </div>
    </div>
  )
}
