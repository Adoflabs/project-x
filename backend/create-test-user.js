import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🚀 Creating test company and user...\n');

    // Create company
    const company = await prisma.company.create({
      data: {
        name: 'Demo Company',
        plan: 'starter',
        configJson: {
          formula: {
            components: [
              { name: 'Quality', weight: 40, scale: 100 },
              { name: 'Output', weight: 35, scale: 100 },
              { name: 'Feedback', weight: 25, scale: 100 }
            ],
            frequency: 'monthly'
          }
        },
      },
    });

    console.log('✅ Company created!');
    console.log('   ID:', company.id);
    console.log('   Name:', company.name);
    console.log('');

    // Create user
    const userId = crypto.randomUUID();
    const user = await prisma.user.create({
      data: {
        id: userId,
        companyId: company.id,
        role: 'owner',
        email: 'admin@demo.com',
      },
    });

    console.log('✅ User created!');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   Company ID:', user.companyId);
    console.log('');

    console.log('🎉 Success! You can now use these credentials:');
    console.log('');
    console.log('   📧 Email: admin@demo.com');
    console.log('   🔑 Role: owner');
    console.log('   🏢 Company: Demo Company');
    console.log('');
    console.log('⚠️  Note: Password authentication is not implemented yet.');
    console.log('   The login will work once you add password field to schema.');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'P2002') {
      console.log('\n💡 Tip: User or company might already exist. Try deleting them first.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
