"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function addMonthlyDebt(clientId: string, data: { month: number, year: number, amount: number }) {
    const session = await getServerSession(authOptions)
    if (!session?.user) throw new Error("Não autenticado")

    // Verificar se o cliente pertence a este utilizador
    const client = await prisma.client.findFirst({
        where: { id: clientId, userId: session.user.id }
    })

    if (!client) throw new Error("Cliente não encontrado.")

    // Criar na DB
    await prisma.$transaction(async (tx) => {
        // Criar dívida
        await tx.monthlyDebt.create({
            data: {
                clientId,
                month: data.month,
                year: data.year,
                amount: data.amount,
                amountPending: data.amount,
                amountPaid: 0
            }
        })

        // Atualizar saldo pendente global do cliente
        await tx.client.update({
            where: { id: clientId },
            data: {
                pendingBalance: {
                    increment: data.amount
                }
            }
        })
    })

    revalidatePath(`/clientes/${clientId}`)
    revalidatePath(`/clientes`)
}

export async function getClientWithDebts(clientId: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user) throw new Error("Não autenticado")

    const client = await prisma.client.findFirst({
        where: { id: clientId, userId: session.user.id },
        include: {
            monthlyDebts: {
                orderBy: [
                    { year: 'desc' },
                    { month: 'desc' }
                ]
            }
        }
    })

    if (!client) throw new Error("Cliente não encontrado.")
    return client
}
