const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany()
    if (users.length > 0) {
        const user = users[0]
        console.log(`User found: ${user.name} / ${user.email}`)
        if (!user.email.includes('@')) {
            await prisma.user.update({
                where: { id: user.id },
                data: { email: 'user@example.com' } // Fallback email
            })
            console.log(`Email reset to user@example.com`)
        } else {
            console.log(`Email seems valid: ${user.email}`)
            // Force reset just in case
            await prisma.user.update({
                where: { id: user.id },
                data: { email: 'user@example.com' }
            })
            console.log(`Email explicitly reset to user@example.com`)
        }
    } else {
        console.log("No users found")
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
