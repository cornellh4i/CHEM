import { PrismaClient, Role, FundType, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Organization
  const org = await prisma.organization.upsert({
    where: { id: "carl-test-org" },
    update: {},
    create: {
      id: "carl-test-org",
      name: "Carl's Test Foundation",
      description: "Test organization for development",
    },
  });

  // Users
  await prisma.user.upsert({
    where: { email: "carlhu2@gmail.com" },
    update: {
      firebaseUid: "H2Jy5D6hzzVxobKA1kS3waIlZNv2",
      organizationId: org.id,
      firstName: "Carl",
      lastName: "Hu",
      role: Role.ADMIN,
    },
    create: {
      firebaseUid: "H2Jy5D6hzzVxobKA1kS3waIlZNv2",
      email: "carlhu2@gmail.com",
      firstName: "Carl",
      lastName: "Hu",
      role: Role.ADMIN,
      organizationId: org.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "testing123@gmail.com" },
    update: {
      firebaseUid: "clYXSbY9LrVFhJHnH4mayqxQmYF2",
      organizationId: org.id,
      firstName: "Test",
      lastName: "User",
      role: Role.USER,
    },
    create: {
      firebaseUid: "clYXSbY9LrVFhJHnH4mayqxQmYF2",
      email: "testing123@gmail.com",
      firstName: "Test",
      lastName: "User",
      role: Role.USER,
      organizationId: org.id,
    },
  });

  // Contributors
  const alice = await prisma.contributor.create({
    data: {
      firstName: "Alice",
      lastName: "Johnson",
      organization: { connect: { id: org.id } },
    },
  });

  const bob = await prisma.contributor.create({
    data: {
      firstName: "Bob",
      lastName: "Smith",
      organization: { connect: { id: org.id } },
    },
  });

  const carol = await prisma.contributor.create({
    data: {
      firstName: "Carol",
      lastName: "Williams",
      organization: { connect: { id: org.id } },
    },
  });

  const david = await prisma.contributor.create({
    data: {
      firstName: "David",
      lastName: "Lee",
      organization: { connect: { id: org.id } },
    },
  });

  // Funds
  const generalFund = await prisma.fund.create({
    data: {
      name: "General Scholarship Fund",
      description: "Unrestricted donations for general scholarships",
      organizationId: org.id,
      type: FundType.DONATION,
      restriction: false,
      amount: 0,
      units: 0,
      contributors: { connect: [{ id: alice.id }, { id: bob.id }, { id: carol.id }] },
    },
  });

  const endowmentFund = await prisma.fund.create({
    data: {
      name: "Endowment Growth Fund",
      description: "Long-term endowment for capital growth",
      organizationId: org.id,
      type: FundType.ENDOWMENT,
      restriction: true,
      purpose: "Restricted to long-term capital investment only.",
      rate: 0.05,
      amount: 0,
      units: 0,
      contributors: { connect: [{ id: alice.id }, { id: david.id }] },
    },
  });

  const techFund = await prisma.fund.create({
    data: {
      name: "Technology Initiative Fund",
      description: "Funding for tech programs and infrastructure",
      organizationId: org.id,
      type: FundType.DONATION,
      restriction: false,
      amount: 0,
      units: 0,
      contributors: { connect: [{ id: bob.id }, { id: carol.id }, { id: david.id }] },
    },
  });

  const researchFund = await prisma.fund.create({
    data: {
      name: "Research Endowment",
      description: "Restricted endowment for academic research",
      organizationId: org.id,
      type: FundType.ENDOWMENT,
      restriction: true,
      purpose: "Restricted to faculty and student research projects.",
      rate: 0.04,
      amount: 0,
      units: 0,
      contributors: { connect: [{ id: carol.id }, { id: david.id }] },
    },
  });

  // Transactions — spread over the past 6 months
  const d = (monthsAgo: number, day: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    date.setDate(day);
    return date;
  };

  // General Fund transactions
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: generalFund.id, contributorId: alice.id, type: TransactionType.DONATION, date: d(5, 3), amount: 2000, description: "Annual scholarship donation" } });
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: generalFund.id, contributorId: bob.id, type: TransactionType.DONATION, date: d(4, 15), amount: 1500, description: "Spring donation" } });
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: generalFund.id, contributorId: carol.id, type: TransactionType.DONATION, date: d(3, 8), amount: 3000, description: "Major gift" } });
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: generalFund.id, contributorId: alice.id, type: TransactionType.EXPENSE, date: d(2, 20), amount: 800, description: "Scholarship disbursement Q1" } });
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: generalFund.id, contributorId: bob.id, type: TransactionType.WITHDRAWAL, date: d(1, 10), amount: 500, description: "Program operating costs" } });
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: generalFund.id, contributorId: carol.id, type: TransactionType.DONATION, date: d(0, 5), amount: 1000, description: "Recent donation" } });

  // Endowment Fund transactions
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: endowmentFund.id, contributorId: alice.id, type: TransactionType.DONATION, date: d(5, 10), amount: 5000, description: "Founding endowment gift" } });
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: endowmentFund.id, contributorId: david.id, type: TransactionType.DONATION, date: d(4, 2), amount: 10000, description: "Major endowment contribution" } });
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: endowmentFund.id, contributorId: alice.id, type: TransactionType.INVESTMENT, date: d(3, 18), amount: 3000, description: "Quarterly investment allocation" } });
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: endowmentFund.id, contributorId: david.id, type: TransactionType.INVESTMENT, date: d(1, 22), amount: 2000, description: "Reinvestment of returns" } });

  // Tech Fund transactions
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: techFund.id, contributorId: bob.id, type: TransactionType.DONATION, date: d(5, 1), amount: 1200, description: "Tech infrastructure donation" } });
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: techFund.id, contributorId: carol.id, type: TransactionType.DONATION, date: d(4, 12), amount: 800, description: "Software licensing support" } });
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: techFund.id, contributorId: david.id, type: TransactionType.DONATION, date: d(3, 25), amount: 2500, description: "Hardware grant" } });
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: techFund.id, contributorId: bob.id, type: TransactionType.EXPENSE, date: d(2, 7), amount: 600, description: "Server costs Q2" } });
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: techFund.id, contributorId: carol.id, type: TransactionType.EXPENSE, date: d(0, 14), amount: 400, description: "Software subscriptions" } });

  // Research Fund transactions
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: researchFund.id, contributorId: carol.id, type: TransactionType.DONATION, date: d(5, 20), amount: 4000, description: "Research endowment seed gift" } });
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: researchFund.id, contributorId: david.id, type: TransactionType.DONATION, date: d(4, 8), amount: 6000, description: "Faculty research grant" } });
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: researchFund.id, contributorId: carol.id, type: TransactionType.INVESTMENT, date: d(2, 14), amount: 1500, description: "Endowment investment" } });
  await prisma.transaction.create({ data: { organizationId: org.id, fundId: researchFund.id, contributorId: david.id, type: TransactionType.WITHDRAWAL, date: d(1, 3), amount: 700, description: "Student stipend disbursement" } });

  // Update fund balances
  await prisma.fund.update({ where: { id: generalFund.id }, data: { amount: 6200 } });
  await prisma.fund.update({ where: { id: endowmentFund.id }, data: { amount: 20000, units: 400 } });
  await prisma.fund.update({ where: { id: techFund.id }, data: { amount: 3500 } });
  await prisma.fund.update({ where: { id: researchFund.id }, data: { amount: 10800, units: 270 } });

  // Update org total
  await prisma.organization.update({ where: { id: org.id }, data: { amount: 40500 } });

  console.log("Seed complete: Carl's Test Foundation with 4 contributors, 4 funds, 19 transactions");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
