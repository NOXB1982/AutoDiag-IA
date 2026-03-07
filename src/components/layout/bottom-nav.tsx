import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { BottomNavList } from "./bottom-nav-list"

export async function BottomNav() {
    const session = await getServerSession(authOptions)
    const isAdmin = session?.user?.role === "ADMIN"

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-around border-t border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80 md:hidden">
            <BottomNavList isAdmin={isAdmin} />
        </div>
    )
}
