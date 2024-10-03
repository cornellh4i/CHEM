import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Organizations
  const techCorp = await prisma.organization.upsert({
    where: { id: "techcorp-id" },
    update: {},
    create: {
      id: "techcorp-id",
      name: "TechCorp",
      description: "A leading technology company",
    },
  });

  const ecoFoundation = await prisma.organization.upsert({
    where: { id: "ecofoundation-id" },
    update: {},
    create: {
      id: "ecofoundation-id",
      name: "Eco Foundation",
      description: "Non-profit organization for environmental causes",
    },
  });

  // Create Users
  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      firstName: "Alice",
      lastName: "Johnson",
      role: Role.USER,
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      firstName: "Bob",
      lastName: "Smith",
      role: Role.ADMIN,
    },
  });

  // Create Contributors
  const charlie = await prisma.contributor.create({
    data: {
      firstName: "Charlie",
      lastName: "Brown",
      organization: {
        connect: { id: techCorp.id },
      },
    },
  });

  const diana = await prisma.contributor.create({
    data: {
      firstName: "Diana",
      lastName: "Prince",
      organization: {
        connect: { id: ecoFoundation.id },
      },
    },
  });

  console.log({ techCorp, ecoFoundation, alice, bob, charlie, diana });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
