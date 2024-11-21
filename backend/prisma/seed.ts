import { PrismaClient, Role, TransactionType } from "@prisma/client";

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
      id: "charlie-id",
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

  // Seed three transactions for Charlie
  const charlieTransaction1 = await prisma.transaction.create({
    data: {
      organizationId: techCorp.id,
      contributorId: charlie.id,
      type: TransactionType.DONATION,
      date: new Date("2024-01-01"),
      amount: 100,
      description: "Donation of $100 by Charlie",
    },
  });

  const charlieTransaction2 = await prisma.transaction.create({
    data: {
      organizationId: techCorp.id,
      contributorId: charlie.id,
      type: TransactionType.DONATION,
      date: new Date("2024-01-02"),
      amount: 200,
      description: "Donation of $200 by Charlie",
    },
  });

  const charlieTransaction3 = await prisma.transaction.create({
    data: {
      organizationId: techCorp.id,
      contributorId: charlie.id,
      type: TransactionType.DONATION,
      date: new Date("2024-01-03"),
      amount: 300,
      description: "Donation of $300 by Charlie",
    },
  });

  console.log({
    techCorp,
    ecoFoundation,
    alice,
    bob,
    charlie,
    diana,
    charlieTransaction1,
    charlieTransaction2,
    charlieTransaction3,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
