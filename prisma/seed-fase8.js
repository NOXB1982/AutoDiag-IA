const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10)

    // Criar Vendedor
    const user = await prisma.user.upsert({
        where: { email: 'vendedor@demo.com' },
        update: {},
        create: {
            email: 'vendedor@demo.com',
            name: 'Vendedor Demo',
            password: hashedPassword,
            role: 'VENDEDOR'
        },
    })

    // Criar clientes com divida (usando prisma transactions)
    const clientA = await prisma.client.create({
        data: {
            name: 'Cliente Importado A',
            whatsapp: '912345678',
            address: 'Porto',
            userId: user.id,
            pendingBalance: 150,
            monthlyDebts: {
                create: [
                    { month: 1, year: 2026, amount: 50, amountPending: 50 },
                    { month: 2, year: 2026, amount: 100, amountPending: 100 }
                ]
            }
        }
    })

    const clientB = await prisma.client.create({
        data: {
            name: 'Nova Empresa XPTO',
            whatsapp: '987654321',
            address: 'Lisboa',
            userId: user.id,
            pendingBalance: 500,
            monthlyDebts: {
                create: [
                    { month: 12, year: 2025, amount: 500, amountPending: 500 }
                ]
            }
        }
    })

    // Criar Daily Log p/ hoje para testar pdfs
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const dateString = `${yyyy}-${mm}-${dd}`

    await prisma.dailyLog.upsert({
        where: {
            userId_dateString: {
                userId: user.id,
                dateString: dateString
            }
        },
        update: { closed: true, kmFinal: 250, kmTotal: 150 },
        create: {
            userId: user.id,
            dateString: dateString,
            kmInitial: 100,
            kmFinal: 250,
            kmTotal: 150,
            closed: true
        }
    })

    // Criar Visita
    await prisma.visit.create({
        data: {
            clientId: clientB.id,
            userId: user.id,
            date: today,
            status: 'REALIZADA',
            type: 'RECEBIMENTO',
            notes: 'Pagamento recebido em cheque visado.',
            receiptAmount: 300
        }
    })

    console.log({ user, clientA, clientB })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
