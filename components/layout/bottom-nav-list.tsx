"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, CalendarCheck, Car, FileText, Briefcase, Settings } from "lucide-react"

const baseNavItems = [
    { name: "Painel IA", href: "/", icon: Home },
    { name: "Viaturas", href: "/viaturas", icon: Car },
    { name: "Ajustes", href: "/ajustes", icon: Settings },
]

export function BottomNavList({ isAdmin }: { isAdmin?: boolean }) {
    const pathname = usePathname()

    const items = isAdmin
        ? [...baseNavItems, { name: "Admin", href: "/administracao", icon: Briefcase }]
        : baseNavItems

    return (
        <>
            {items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(`${item.href}/`))

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                            }`}
                    >
                        <Icon className="h-5 w-5" />
                        <span className="text-[10px] font-medium">{item.name}</span>
                    </Link>
                )
            })}
        </>
    )
}
