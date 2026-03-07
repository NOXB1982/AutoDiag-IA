"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, CalendarCheck, Map, Car, Settings, FileText, Briefcase, BarChart3 } from "lucide-react"

const baseNavItems = [
    { name: "Painel IA", href: "/", icon: Home },
    { name: "Viaturas", href: "/viaturas", icon: Car },
    { name: "Ajustes", href: "/ajustes", icon: Settings },
]

export function SidebarNav({ isAdmin }: { isAdmin?: boolean }) {
    const pathname = usePathname()

    const items = isAdmin
        ? [
            ...baseNavItems,
            { name: "Administração", href: "/administracao", icon: Briefcase }
        ]
        : baseNavItems

    return (
        <nav className="flex flex-col gap-1 px-4">
            {items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(`${item.href}/`))

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                            }`}
                    >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                    </Link>
                )
            })}
        </nav>
    )
}
