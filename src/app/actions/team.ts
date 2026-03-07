"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { z } from "zod"

const memberSchema = z.object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres"),
})

export async function getTeamMembers() {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Acesso negado: Apenas o Administrador pode ver a equipa.")
    }

    const members = await prisma.user.findMany({
        where: { role: "VENDEDOR" },
        orderBy: { name: 'asc' },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            _count: {
                select: {
                    clients: true,
                    visits: true
                }
            }
        }
    })

    return members
}

export async function createTeamMember(formData: FormData) {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Acesso negado: Apenas o Administrador gerir a equipa.")
    }

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate
    const parsed = memberSchema.safeParse({ name, email, password })
    if (!parsed.success) {
        throw new Error(parsed.error.issues[0].message)
    }

    // Check if email exists
    const existing = await prisma.user.findUnique({
        where: { email }
    })

    if (existing) {
        throw new Error("Este email já está registado num utilizador.")
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "VENDEDOR"
        }
    })

    revalidatePath("/equipa")
}
