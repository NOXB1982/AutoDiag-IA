const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function run() {
    try {
        const hashedPassword = await bcrypt.hash('123456', 10)
        const result = await prisma.user.updateMany({
            where: { email: 'teu-nome@crm.com' },
            data: { password: hashedPassword }
        })
        console.log(`Password reset successfully for ${result.count} users.`)
    } catch (error) {
        console.error("Error resetting password:", error)
    } finally {
        await prisma.$disconnect()
    }
}
run()
