"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getMonthlyReports(month: number, year: number) {
    const session = await getServerSession(authOptions)
    if (!session?.user) throw new Error("Não autenticado")

    const datePrefix = `${year}-${String(month).padStart(2, '0')}`

    const reports = await prisma.dailyLog.findMany({
        where: {
            userId: session.user.id,
            dateString: {
                startsWith: datePrefix
            },
            closed: true
        },
        orderBy: {
            dateString: 'desc'
        },
        include: {
            user: true
        }
    })

    // Como as Visitas são independentes do DailyLog no schema,
    // precisamos de ir buscar as visitas correspondentes a cada data
    const reportsWithVisits = await Promise.all(
        reports.map(async (report) => {
            const startDate = new Date(`${report.dateString}T00:00:00Z`)
            const endDate = new Date(`${report.dateString}T23:59:59Z`)

            const visits = await prisma.visit.findMany({
                where: {
                    userId: session.user.id,
                    date: {
                        gte: startDate,
                        lte: endDate,
                    }
                },
                include: {
                    client: true
                },
                orderBy: {
                    date: 'asc'
                }
            })

            const totalReceived = visits
                .filter(v => v.status === "REALIZADA" && v.type === "RECEBIMENTO")
                .reduce((acc, v) => acc + (v.receiptAmount || 0), 0)

            return {
                ...report,
                visits,
                totalReceived
            }
        })
    )

    return reportsWithVisits
}
