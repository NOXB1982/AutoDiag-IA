import Link from "next/link"
import { Home, Users, CalendarCheck, Map, Car, Settings, FileText, Briefcase, BarChart3 } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { LogoutButton } from "./logout-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarNav } from "./sidebar-nav"

export async function Sidebar() {
    const session = await getServerSession(authOptions)
    const isAdmin = session?.user?.role === "ADMIN"

    return (
        <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 md:flex h-screen sticky top-0">
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    AutoDiag AI
                </span>
                <ThemeToggle />
            </div>
            <div className="flex-1 overflow-auto py-4">
                <SidebarNav isAdmin={isAdmin} />
            </div>
            <div className="mt-auto border-t border-gray-200 p-4 dark:border-gray-800">
                <LogoutButton />
            </div>
        </aside>
    )
}
