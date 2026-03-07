const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function run() {
    const user = await prisma.user.findFirst()
    if (user) {
        await prisma.user.update({
            where: { id: user.id },
            data: { email: 'teu-nome@crm.com' }
        })
        console.log("Email reset successfully")
    }
}
run()
