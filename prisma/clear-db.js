const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Starting generic database clean up...')

    try {
        // Delete in order to avoid foreign key constraints
        const deletes = [
            prisma.monthlyDebt.deleteMany(),
            prisma.visit.deleteMany(),
            prisma.dailyLog.deleteMany(),
            prisma.client.deleteMany()
            // Intentionally NOT deleting User to keep Admin account active
        ]

        await prisma.$transaction(deletes)
        console.log('✅ Base de dados perfeitamente limpa (Clientes, Visitas, Dívidas e Logs Múltiplos). Conta Admin mantida.')

    } catch (error) {
        console.error('❌ Erro a limpar a BD:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
