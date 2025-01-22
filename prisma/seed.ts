import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createMasterRole() {
  const role = ['admin', 'member'];

  try {
    await prisma
      .$executeRawUnsafe(`truncate "Role" restart identity cascade `)
      .then(async (result) => {
        const createdRoles = await prisma.role.createMany({
          data: role.map((item) => {
            return {
              name: item,
            };
          }),
        });

        console.log(createdRoles);
      });
  } catch (e) {
    console.log(e);
  }
}

async function main() {
  await createMasterRole();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
