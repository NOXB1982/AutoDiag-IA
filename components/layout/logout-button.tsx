"use client"

import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:bg-red-50 hover:text-red-700 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sair</span>
        </button>
    )
}
