import { createClient } from "@/lib/supabase/server"
import { DashboardTabs } from "@/components/dashboard-tabs"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <DashboardTabs
      isAuthenticated={!!user}
      userEmail={user?.email ?? null}
    />
  )
}
