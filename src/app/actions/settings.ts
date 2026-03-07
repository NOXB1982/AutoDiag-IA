"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

export async function updateProfile(data: { name: string, email: string, currentPassword?: string, newPassword?: string }) {
    const session = await getServerSession(authOptions)
    if (!session?.user) throw new Error("Não autenticado")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user) throw new Error("Utilizador não encontrado")

    // Verifica se o email novo já está em uso por outro utilizador
    if (data.email !== user.email) {
        const existingEmail = await prisma.user.findUnique({ where: { email: data.email } })
        if (existingEmail) throw new Error("Este email já está em uso.")
    }

    const updateData: any = { name: data.name, email: data.email }

    if (data.newPassword && data.currentPassword) {
        const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password)
        if (!isPasswordValid) {
            throw new Error("A palavra-passe atual está incorreta.")
        }
        updateData.password = await bcrypt.hash(data.newPassword, 10)
    }

    await prisma.user.update({
        where: { id: user.id },
        data: updateData
    })

    revalidatePath("/definicoes")
    return { success: true }
}
