// This script tests creating a Google user directly in the database
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting Google user creation test...');
    
    // Generate a unique email
    const testEmail = `google_test_${Date.now()}@example.com`;
    
    // Create a test Google user
    const user = await prisma.user.create({
      data: {
        name: "Test Google User",
        email: testEmail,
        role: "USER",
        emailVerified: new Date(),
      }
    });
    
    console.log("Successfully created Google test user:", user);
    
    // Now create a corresponding account
    const account = await prisma.account.create({
      data: {
        userId: user.id,
        type: "oauth",
        provider: "google",
        providerAccountId: `test_${Date.now()}`,
        access_token: "test_token",
        id_token: "test_id_token",
        token_type: "bearer",
        scope: "email profile",
      }
    });
    
    console.log("Successfully created account:", account);
    
    // Test reading the user back with its account
    const userWithAccount = await prisma.user.findUnique({
      where: { id: user.id },
      include: { accounts: true }
    });
    
    console.log("User with account:", userWithAccount);
    
  } catch (error) {
    console.error("Error in test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 