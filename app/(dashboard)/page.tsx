import { DashboardClient } from "@/components/dashboard-client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null

  // Format the user object strictly to match what DashboardClient expects
  const autoDiagUser = {
    name: session.user.name,
    email: session.user.email,
    role: session.user.role || "MECHANIC"
  }

  return (
    <div className="space-y-6">
      <DashboardClient user={autoDiagUser} />
    </div>
  )
}
