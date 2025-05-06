const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const testUser = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test" + Date.now() + "@example.com",
        role: "USER",
      }
    });
    console.log("Successfully created user:", testUser);
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();