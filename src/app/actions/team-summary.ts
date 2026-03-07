"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getTeamSummary() {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Acesso negado: Apenas o Administrador pode ver o resumo da equipa.")
    }

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    // 1. Get all vendors
    const vendors = await prisma.user.findMany({
        where: { role: "VENDEDOR" },
        select: { id: true, name: true }
    })

    // 2. Get visits of type "RECEBIMENTO" and status "REALIZADA" for this month
    const receivedVisits = await prisma.visit.findMany({
        where: {
            type: "RECEBIMENTO",
            status: "REALIZADA",
            date: {
                gte: new Date(currentYear, currentMonth, 1),
                lt: new Date(currentYear, currentMonth + 1, 1)
            }
        },
        select: {
            userId: true,
            receiptAmount: true
        }
    })

    // 3. Get today's daily log per vendor
    const today = new Date()
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    const dailyLogs = await prisma.dailyLog.findMany({
        where: {
            dateString: todayString
        },
        select: {
            userId: true,
            closed: true, // true === "ENCERRADO"
            kmInitial: true,
            kmFinal: true
        }
    })

    // 4. Aggregate results per vendor
    const summary = vendors.map((vendor: { id: string; name: string }) => {
        const vendorReceipts = receivedVisits.filter((v: { userId: string }) => v.userId === vendor.id)
        const totalReceived = vendorReceipts.reduce((acc: number, curr: { receiptAmount: number | null }) => acc + (curr.receiptAmount || 0), 0)

        const vendorLog = dailyLogs.find((log: { userId: string; closed: boolean; kmInitial: number; kmFinal: number | null }) => log.userId === vendor.id)

        let kmStatus = "Não Iniciado"
        if (vendorLog) {
            kmStatus = vendorLog.closed ? "Dia Encerrado" : "Em Curso"
        }

        return {
            vendorId: vendor.id,
            vendorName: vendor.name,
            totalReceived,
            receiptsCount: vendorReceipts.length,
            kmStatus,
            startKm: vendorLog?.startKm,
            endKm: vendorLog?.endKm
        }
    })

    // Sort by higher received amount
    summary.sort((a: { totalReceived: number }, b: { totalReceived: number }) => b.totalReceived - a.totalReceived)

    // Calculate global total
    const globalTotal = summary.reduce((acc: number, curr: { totalReceived: number }) => acc + curr.totalReceived, 0)

    return {
        summary,
        globalTotal
    }
}
