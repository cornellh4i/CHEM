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

  // Contributors (upsert by fixed id so re-runs are safe)
  const alice = await prisma.contributor.upsert({
    where: { id: "seed-contributor-alice" },
    update: {},
    create: {
      id: "seed-contributor-alice",
      firstName: "Alice",
      lastName: "Johnson",
      organizationId: org.id,
    },
  });

  const bob = await prisma.contributor.upsert({
    where: { id: "seed-contributor-bob" },
    update: {},
    create: {
      id: "seed-contributor-bob",
      firstName: "Bob",
      lastName: "Smith",
      organizationId: org.id,
    },
  });

  const carol = await prisma.contributor.upsert({
    where: { id: "seed-contributor-carol" },
    update: {},
    create: {
      id: "seed-contributor-carol",
      firstName: "Carol",
      lastName: "Williams",
      organizationId: org.id,
    },
  });

  const david = await prisma.contributor.upsert({
    where: { id: "seed-contributor-david" },
    update: {},
    create: {
      id: "seed-contributor-david",
      firstName: "David",
      lastName: "Lee",
      organizationId: org.id,
    },
  });

  const sarah = await prisma.contributor.upsert({
    where: { id: "seed-contributor-sarah" },
    update: {},
    create: {
      id: "seed-contributor-sarah",
      firstName: "Sarah",
      lastName: "Clay",
      organizationId: org.id,
    },
  });

  // Funds (upsert by fixed id)
  const generalFund = await prisma.fund.upsert({
    where: { id: "seed-fund-general" },
    update: {},
    create: {
      id: "seed-fund-general",
      name: "General Scholarship Fund",
      description: "Unrestricted donations for general scholarships",
      organizationId: org.id,
      type: FundType.DONATION,
      restriction: false,
      amount: 0,
      units: 0,
      contributors: {
        connect: [{ id: alice.id }, { id: bob.id }, { id: carol.id }, { id: sarah.id }],
      },
    },
  });

  const endowmentFund = await prisma.fund.upsert({
    where: { id: "seed-fund-endowment" },
    update: {},
    create: {
      id: "seed-fund-endowment",
      name: "Endowment Growth Fund",
      description: "Long-term endowment for capital growth",
      organizationId: org.id,
      type: FundType.ENDOWMENT,
      restriction: true,
      purpose: "Restricted to long-term capital investment only.",
      rate: 0.05,
      amount: 0,
      units: 0,
      contributors: { connect: [{ id: alice.id }, { id: david.id }, { id: sarah.id }] },
    },
  });

  const techFund = await prisma.fund.upsert({
    where: { id: "seed-fund-tech" },
    update: {},
    create: {
      id: "seed-fund-tech",
      name: "Technology Initiative Fund",
      description: "Funding for tech programs and infrastructure",
      organizationId: org.id,
      type: FundType.DONATION,
      restriction: false,
      amount: 0,
      units: 0,
      contributors: {
        connect: [{ id: bob.id }, { id: carol.id }, { id: david.id }],
      },
    },
  });

  const researchFund = await prisma.fund.upsert({
    where: { id: "seed-fund-research" },
    update: {},
    create: {
      id: "seed-fund-research",
      name: "Research Endowment",
      description: "Restricted endowment for academic research",
      organizationId: org.id,
      type: FundType.ENDOWMENT,
      restriction: true,
      purpose: "Restricted to faculty and student research projects.",
      rate: 0.04,
      amount: 0,
      units: 0,
      contributors: { connect: [{ id: carol.id }, { id: david.id }, { id: sarah.id }] },
    },
  });

  // Transactions — upsert by fixed id, spread across 12 months
  const d = (monthsAgo: number, day: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    date.setDate(day);
    return date;
  };

  // Helper for years ago
  const y = (yearsAgo: number, month: number, day: number) => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - yearsAgo);
    date.setMonth(month - 1);
    date.setDate(day);
    return date;
  };

  const transactions: {
    id: string;
    organizationId: string;
    fundId: string;
    contributorId: string;
    type: TransactionType;
    date: Date;
    amount: number;
    description: string;
  }[] = [
    // --- General Scholarship Fund ---
    { id: "tx-001", organizationId: org.id, fundId: generalFund.id, contributorId: alice.id,   type: TransactionType.DONATION,    date: d(11, 3),  amount: 2000,  description: "Annual scholarship donation" },
    { id: "tx-002", organizationId: org.id, fundId: generalFund.id, contributorId: bob.id,     type: TransactionType.DONATION,    date: d(10, 15), amount: 1500,  description: "Fall donation" },
    { id: "tx-003", organizationId: org.id, fundId: generalFund.id, contributorId: carol.id,   type: TransactionType.DONATION,    date: d(9, 8),   amount: 3000,  description: "Major gift" },
    { id: "tx-004", organizationId: org.id, fundId: generalFund.id, contributorId: sarah.id,   type: TransactionType.DONATION,    date: d(8, 20),  amount: 4500,  description: "Sarah Clay scholarship gift" },
    { id: "tx-005", organizationId: org.id, fundId: generalFund.id, contributorId: alice.id,   type: TransactionType.EXPENSE,     date: d(7, 20),  amount: 800,   description: "Scholarship disbursement Q1" },
    { id: "tx-006", organizationId: org.id, fundId: generalFund.id, contributorId: bob.id,     type: TransactionType.WITHDRAWAL,  date: d(6, 10),  amount: 500,   description: "Program operating costs" },
    { id: "tx-007", organizationId: org.id, fundId: generalFund.id, contributorId: carol.id,   type: TransactionType.DONATION,    date: d(5, 5),   amount: 2200,  description: "Spring gift" },
    { id: "tx-008", organizationId: org.id, fundId: generalFund.id, contributorId: sarah.id,   type: TransactionType.DONATION,    date: d(4, 12),  amount: 3800,  description: "Q3 contribution" },
    { id: "tx-009", organizationId: org.id, fundId: generalFund.id, contributorId: alice.id,   type: TransactionType.DONATION,    date: d(3, 7),   amount: 1800,  description: "End of year gift" },
    { id: "tx-010", organizationId: org.id, fundId: generalFund.id, contributorId: bob.id,     type: TransactionType.DONATION,    date: d(2, 18),  amount: 2600,  description: "Spring contribution" },
    { id: "tx-011", organizationId: org.id, fundId: generalFund.id, contributorId: carol.id,   type: TransactionType.DONATION,    date: d(1, 9),   amount: 1400,  description: "Monthly giving" },
    { id: "tx-012", organizationId: org.id, fundId: generalFund.id, contributorId: sarah.id,   type: TransactionType.DONATION,    date: d(0, 4),   amount: 5200,  description: "This month donation" },

    // --- Endowment Growth Fund ---
    { id: "tx-013", organizationId: org.id, fundId: endowmentFund.id, contributorId: alice.id,  type: TransactionType.DONATION,   date: d(11, 10), amount: 5000,  description: "Founding endowment gift" },
    { id: "tx-014", organizationId: org.id, fundId: endowmentFund.id, contributorId: david.id,  type: TransactionType.DONATION,   date: d(10, 2),  amount: 10000, description: "Major endowment contribution" },
    { id: "tx-015", organizationId: org.id, fundId: endowmentFund.id, contributorId: sarah.id,  type: TransactionType.DONATION,   date: d(9, 5),   amount: 8000,  description: "Endowment pledge" },
    { id: "tx-016", organizationId: org.id, fundId: endowmentFund.id, contributorId: alice.id,  type: TransactionType.INVESTMENT, date: d(8, 18),  amount: 3000,  description: "Q1 investment allocation" },
    { id: "tx-017", organizationId: org.id, fundId: endowmentFund.id, contributorId: david.id,  type: TransactionType.INVESTMENT, date: d(6, 22),  amount: 2000,  description: "Reinvestment of returns" },
    { id: "tx-018", organizationId: org.id, fundId: endowmentFund.id, contributorId: sarah.id,  type: TransactionType.DONATION,   date: d(4, 14),  amount: 6500,  description: "Mid-year endowment gift" },
    { id: "tx-019", organizationId: org.id, fundId: endowmentFund.id, contributorId: alice.id,  type: TransactionType.INVESTMENT, date: d(2, 3),   amount: 4000,  description: "Q3 investment" },
    { id: "tx-020", organizationId: org.id, fundId: endowmentFund.id, contributorId: david.id,  type: TransactionType.DONATION,   date: d(0, 8),   amount: 3500,  description: "This month endowment gift" },

    // --- Technology Initiative Fund ---
    { id: "tx-021", organizationId: org.id, fundId: techFund.id, contributorId: bob.id,    type: TransactionType.DONATION,   date: d(11, 1),  amount: 1200,  description: "Tech infrastructure donation" },
    { id: "tx-022", organizationId: org.id, fundId: techFund.id, contributorId: carol.id,  type: TransactionType.DONATION,   date: d(10, 12), amount: 800,   description: "Software licensing support" },
    { id: "tx-023", organizationId: org.id, fundId: techFund.id, contributorId: david.id,  type: TransactionType.DONATION,   date: d(9, 25),  amount: 2500,  description: "Hardware grant" },
    { id: "tx-024", organizationId: org.id, fundId: techFund.id, contributorId: bob.id,    type: TransactionType.DONATION,   date: d(8, 6),   amount: 1900,  description: "Network upgrade fund" },
    { id: "tx-025", organizationId: org.id, fundId: techFund.id, contributorId: carol.id,  type: TransactionType.EXPENSE,    date: d(7, 7),   amount: 600,   description: "Server costs Q2" },
    { id: "tx-026", organizationId: org.id, fundId: techFund.id, contributorId: david.id,  type: TransactionType.DONATION,   date: d(6, 19),  amount: 3100,  description: "Innovation gift" },
    { id: "tx-027", organizationId: org.id, fundId: techFund.id, contributorId: bob.id,    type: TransactionType.DONATION,   date: d(5, 22),  amount: 2200,  description: "Lab equipment gift" },
    { id: "tx-028", organizationId: org.id, fundId: techFund.id, contributorId: carol.id,  type: TransactionType.DONATION,   date: d(3, 11),  amount: 1700,  description: "Fall tech gift" },
    { id: "tx-029", organizationId: org.id, fundId: techFund.id, contributorId: david.id,  type: TransactionType.EXPENSE,    date: d(1, 14),  amount: 400,   description: "Software subscriptions" },
    { id: "tx-030", organizationId: org.id, fundId: techFund.id, contributorId: bob.id,    type: TransactionType.DONATION,   date: d(0, 11),  amount: 2800,  description: "This month tech donation" },

    // --- Research Endowment ---
    { id: "tx-031", organizationId: org.id, fundId: researchFund.id, contributorId: carol.id,  type: TransactionType.DONATION,   date: d(11, 20), amount: 4000,  description: "Research endowment seed gift" },
    { id: "tx-032", organizationId: org.id, fundId: researchFund.id, contributorId: david.id,  type: TransactionType.DONATION,   date: d(10, 8),  amount: 6000,  description: "Faculty research grant" },
    { id: "tx-033", organizationId: org.id, fundId: researchFund.id, contributorId: sarah.id,  type: TransactionType.DONATION,   date: d(9, 15),  amount: 7500,  description: "Research pledge" },
    { id: "tx-034", organizationId: org.id, fundId: researchFund.id, contributorId: carol.id,  type: TransactionType.INVESTMENT, date: d(7, 14),  amount: 1500,  description: "Endowment investment Q2" },
    { id: "tx-035", organizationId: org.id, fundId: researchFund.id, contributorId: david.id,  type: TransactionType.WITHDRAWAL, date: d(6, 3),   amount: 700,   description: "Student stipend disbursement" },
    { id: "tx-036", organizationId: org.id, fundId: researchFund.id, contributorId: sarah.id,  type: TransactionType.DONATION,   date: d(5, 18),  amount: 5000,  description: "Mid-year research gift" },
    { id: "tx-037", organizationId: org.id, fundId: researchFund.id, contributorId: carol.id,  type: TransactionType.DONATION,   date: d(3, 23),  amount: 3200,  description: "Student research fund" },
    { id: "tx-038", organizationId: org.id, fundId: researchFund.id, contributorId: david.id,  type: TransactionType.INVESTMENT, date: d(2, 9),   amount: 2500,  description: "Q3 endowment investment" },
    { id: "tx-039", organizationId: org.id, fundId: researchFund.id, contributorId: sarah.id,  type: TransactionType.DONATION,   date: d(1, 26),  amount: 4800,  description: "Pre-semester gift" },
    { id: "tx-040", organizationId: org.id, fundId: researchFund.id, contributorId: carol.id,  type: TransactionType.DONATION,   date: d(0, 16),  amount: 3600,  description: "This month research gift" },

    // --- 2 years ago ---
    { id: "tx-041", organizationId: org.id, fundId: generalFund.id,    contributorId: alice.id,  type: TransactionType.DONATION,    date: y(2, 1, 10), amount: 3000,  description: "New year scholarship gift" },
    { id: "tx-042", organizationId: org.id, fundId: generalFund.id,    contributorId: bob.id,    type: TransactionType.DONATION,    date: y(2, 3, 5),  amount: 1800,  description: "Spring scholarship" },
    { id: "tx-043", organizationId: org.id, fundId: generalFund.id,    contributorId: carol.id,  type: TransactionType.EXPENSE,     date: y(2, 5, 14), amount: 700,   description: "Program disbursement" },
    { id: "tx-044", organizationId: org.id, fundId: generalFund.id,    contributorId: sarah.id,  type: TransactionType.DONATION,    date: y(2, 7, 22), amount: 4200,  description: "Summer gift" },
    { id: "tx-045", organizationId: org.id, fundId: generalFund.id,    contributorId: alice.id,  type: TransactionType.WITHDRAWAL,  date: y(2, 9, 8),  amount: 600,   description: "Operating withdrawal" },
    { id: "tx-046", organizationId: org.id, fundId: generalFund.id,    contributorId: bob.id,    type: TransactionType.DONATION,    date: y(2, 11, 3), amount: 2100,  description: "Year-end giving" },

    { id: "tx-047", organizationId: org.id, fundId: endowmentFund.id,  contributorId: david.id,  type: TransactionType.DONATION,    date: y(2, 2, 18), amount: 7000,  description: "Endowment gift Q1" },
    { id: "tx-048", organizationId: org.id, fundId: endowmentFund.id,  contributorId: alice.id,  type: TransactionType.INVESTMENT,  date: y(2, 6, 12), amount: 3500,  description: "Mid-year investment" },
    { id: "tx-049", organizationId: org.id, fundId: endowmentFund.id,  contributorId: sarah.id,  type: TransactionType.DONATION,    date: y(2, 10, 1), amount: 9000,  description: "Fall endowment pledge" },

    { id: "tx-050", organizationId: org.id, fundId: techFund.id,       contributorId: carol.id,  type: TransactionType.DONATION,    date: y(2, 2, 7),  amount: 1500,  description: "Tech seed gift" },
    { id: "tx-051", organizationId: org.id, fundId: techFund.id,       contributorId: david.id,  type: TransactionType.DONATION,    date: y(2, 6, 20), amount: 2800,  description: "Infrastructure support" },
    { id: "tx-052", organizationId: org.id, fundId: techFund.id,       contributorId: bob.id,    type: TransactionType.EXPENSE,     date: y(2, 9, 15), amount: 900,   description: "Equipment costs" },

    { id: "tx-053", organizationId: org.id, fundId: researchFund.id,   contributorId: sarah.id,  type: TransactionType.DONATION,    date: y(2, 3, 25), amount: 5500,  description: "Research pledge" },
    { id: "tx-054", organizationId: org.id, fundId: researchFund.id,   contributorId: david.id,  type: TransactionType.INVESTMENT,  date: y(2, 7, 9),  amount: 2000,  description: "Endowment investment" },
    { id: "tx-055", organizationId: org.id, fundId: researchFund.id,   contributorId: carol.id,  type: TransactionType.DONATION,    date: y(2, 11, 18),amount: 4100,  description: "Year-end research gift" },

    // --- 3 years ago ---
    { id: "tx-056", organizationId: org.id, fundId: generalFund.id,    contributorId: sarah.id,  type: TransactionType.DONATION,    date: y(3, 2, 14), amount: 2500,  description: "Early scholarship gift" },
    { id: "tx-057", organizationId: org.id, fundId: generalFund.id,    contributorId: alice.id,  type: TransactionType.DONATION,    date: y(3, 6, 3),  amount: 1600,  description: "Summer contribution" },
    { id: "tx-058", organizationId: org.id, fundId: generalFund.id,    contributorId: bob.id,    type: TransactionType.DONATION,    date: y(3, 10, 19),amount: 3300,  description: "Fall donation" },

    { id: "tx-059", organizationId: org.id, fundId: endowmentFund.id,  contributorId: david.id,  type: TransactionType.DONATION,    date: y(3, 1, 22), amount: 12000, description: "Founding endowment gift" },
    { id: "tx-060", organizationId: org.id, fundId: endowmentFund.id,  contributorId: sarah.id,  type: TransactionType.INVESTMENT,  date: y(3, 5, 7),  amount: 4500,  description: "Initial investment" },
    { id: "tx-061", organizationId: org.id, fundId: endowmentFund.id,  contributorId: alice.id,  type: TransactionType.WITHDRAWAL,  date: y(3, 8, 11), amount: 1000,  description: "Annual distribution" },

    { id: "tx-062", organizationId: org.id, fundId: techFund.id,       contributorId: bob.id,    type: TransactionType.DONATION,    date: y(3, 4, 2),  amount: 2000,  description: "Tech launch gift" },
    { id: "tx-063", organizationId: org.id, fundId: techFund.id,       contributorId: carol.id,  type: TransactionType.DONATION,    date: y(3, 9, 28), amount: 3500,  description: "Infrastructure grant" },

    { id: "tx-064", organizationId: org.id, fundId: researchFund.id,   contributorId: carol.id,  type: TransactionType.DONATION,    date: y(3, 3, 17), amount: 6000,  description: "Research endowment founding" },
    { id: "tx-065", organizationId: org.id, fundId: researchFund.id,   contributorId: david.id,  type: TransactionType.DONATION,    date: y(3, 8, 6),  amount: 4500,  description: "Faculty research gift" },
  ];

  for (const tx of transactions) {
    await prisma.transaction.upsert({
      where: { id: tx.id },
      update: {},
      create: tx,
    });
  }

  // Update fund balances
  await prisma.fund.update({ where: { id: generalFund.id }, data: { amount: 27700 } });
  await prisma.fund.update({ where: { id: endowmentFund.id }, data: { amount: 42000, units: 840 } });
  await prisma.fund.update({ where: { id: techFund.id }, data: { amount: 15700 } });
  await prisma.fund.update({ where: { id: researchFund.id }, data: { amount: 37400, units: 935 } });

  // Update org total
  await prisma.organization.update({ where: { id: org.id }, data: { amount: 122800 } });

  console.log("Seed complete: 5 contributors, 4 funds, 40 transactions across 12 months");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
