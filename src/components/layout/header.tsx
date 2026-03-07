import { ThemeToggle } from "@/components/theme-toggle"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function Header() {
    const session = await getServerSession(authOptions)

    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
            <div className="flex items-center md:hidden">
                <span className="text-lg font-bold">CRM</span>
            </div>
            <div className="hidden md:flex flex-1" />
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                    Olá, {session?.user?.name || "Usuário"}
                </span>
                <ThemeToggle />
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
            </div>
        </header>
    )
}
