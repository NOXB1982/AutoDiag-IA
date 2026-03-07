"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function saveDiagnostic(vehicle: string, parameters: unknown, diagnosis: string) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
        throw new Error("Sessão expirada. Inicie sessão para gravar.")
    }

    try {
        await prisma.diagnostic.create({
            data: {
                userId: session.user.id,
                vehicle,
                parameters: JSON.stringify(parameters),
                diagnosis
            }
        })
        return { success: true }
    } catch (error) {
        console.error("Erro ao guardar diagnóstico:", error)
        throw new Error("Erro de servidor ao guardar no histórico da oficina.")
    }
}
