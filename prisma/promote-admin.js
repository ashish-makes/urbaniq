const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Replace with the email of the user you want to promote
const EMAIL_TO_PROMOTE = 'ashindia.003@gmail.com'

async function main() {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: EMAIL_TO_PROMOTE,
      },
    })

    if (!user) {
      console.error(`User with email ${EMAIL_TO_PROMOTE} not found`)
      return
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: EMAIL_TO_PROMOTE,
      },
      data: {
        role: 'ADMIN',
      },
    })

    console.log(`User ${updatedUser.name} (${updatedUser.email}) has been promoted to ADMIN`)
  } catch (error) {
    console.error('Error promoting user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 