import { PrismaClient, Role, FundType, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Organizations
  const afransOrg = await prisma.organization.upsert({
    where: { id: "afrans-org" },
    update: {},
    create: {
      id: "afrans-org",
      name: "Afran's Org",
      description: "Organization for Afran",
    },
  });

  const mohamedsOrg = await prisma.organization.upsert({
    where: { id: "mohameds-org" },
    update: {},
    create: {
      id: "mohameds-org",
      name: "Mohamed's Org",
      description: "Organization for Mohamed",
    },
  });

  // Create Users (already exist in Firestore; this is for Postgres)
  const afranUser = await prisma.user.upsert({
    where: { email: "test1@gmail.com" },
    update: {
      firebaseUid: "q2B8EUw6v9RqeKnbO0uLTGYEYcP2",
      organizationId: afransOrg.id,
      firstName: "Afran",
      lastName: "Ahmed",
      role: Role.USER,
    },
    create: {
      firebaseUid: "q2B8EUw6v9RqeKnbO0uLTGYEYcP2",
      email: "test1@gmail.com",
      firstName: "Afran",
      lastName: "Ahmed",
      role: Role.USER,
      organizationId: afransOrg.id,
    },
  });

  const mohamedUser = await prisma.user.upsert({
    where: { email: "test2@gmail.com" }, // keeping provided address as-is
    update: {
      firebaseUid: "h1Vd3k44QDfwiqwoelqVleb6xit1",
      organizationId: mohamedsOrg.id,
      firstName: "Mohamed",
      lastName: "Kane",
      role: Role.USER,
    },
    create: {
      firebaseUid: "h1Vd3k44QDfwiqwoelqVleb6xit1",
      email: "test2@gmail.com",
      firstName: "Mohamed",
      lastName: "Kane",
      role: Role.USER,
      organizationId: mohamedsOrg.id,
    },
  });

  // Create Contributors (one per org for transactions)
  const afranSeedContributor = await prisma.contributor.create({
    data: {
      firstName: "Seed",
      lastName: "Contributor",
      organization: { connect: { id: afransOrg.id } },
    },
  });

  const mohamedSeedContributor = await prisma.contributor.create({
    data: {
      firstName: "Seed",
      lastName: "Contributor",
      organization: { connect: { id: mohamedsOrg.id } },
    },
  });

  // === Funds for Afran's Org ===
  // 1) Donation fund
  const afransFoodFund = await prisma.fund.create({
    data: {
      name: "afrans-food-fund",
      description: "Food fund (donation) for Afran's Org",
      organizationId: afransOrg.id,
      type: FundType.DONATION, // ← donation
      restriction: false, // unrestricted donation
      amount: 0,
      units: 0,
      contributors: {
        connect: [{ id: afranSeedContributor.id }],
      },
    },
  });

  // 2) Restricted ENDOWMENT (requires purpose)
  const afransHackFund = await prisma.fund.create({
    data: {
      name: "afrans-hack-fund",
      description: "Hack fund (restricted endowment) for Afran's Org",
      organizationId: afransOrg.id,
      type: FundType.ENDOWMENT, // ← endowment
      restriction: true, // ← restricted endowment
      purpose: "Restricted to hackathon-related expenses only.",
      amount: 0,
      units: 0,
      contributors: {
        connect: [{ id: afranSeedContributor.id }],
      },
    },
  });

  // === Funds for Mohamed's Org ===
  // 3) Unrestricted ENDOWMENT (no purpose required)
  const mohamedsFoodFund = await prisma.fund.create({
    data: {
      name: "mohameds-food-fund",
      description: "Food fund (unrestricted endowment) for Mohamed's Org",
      organizationId: mohamedsOrg.id,
      type: FundType.ENDOWMENT, // ← endowment
      restriction: false, // ← unrestricted endowment
      // purpose omitted for unrestricted
      amount: 0,
      units: 0,
      contributors: {
        connect: [{ id: mohamedSeedContributor.id }],
      },
    },
  });

  // 4) Donation fund
  const mohamedsHackFund = await prisma.fund.create({
    data: {
      name: "mohameds-hack-fund",
      description: "Hack fund (donation) for Mohamed's Org",
      organizationId: mohamedsOrg.id,
      type: FundType.DONATION, // ← donation
      restriction: false,
      amount: 0,
      units: 0,
      contributors: {
        connect: [{ id: mohamedSeedContributor.id }],
      },
    },
  });

  // Create Transactions (a couple per fund)
  // Afran's Org
  await prisma.transaction.create({
    data: {
      organizationId: afransOrg.id,
      fundId: afransFoodFund.id,
      contributorId: afranSeedContributor.id,
      type: TransactionType.DONATION,
      date: new Date(),
      amount: 750,
      description: "Initial donation to afrans-food-fund",
    },
  });
  await prisma.transaction.create({
    data: {
      organizationId: afransOrg.id,
      fundId: afransFoodFund.id,
      contributorId: afranSeedContributor.id,
      type: TransactionType.EXPENSE,
      date: new Date(),
      amount: 200,
      description: "Food purchases",
    },
  });

  await prisma.transaction.create({
    data: {
      organizationId: afransOrg.id,
      fundId: afransHackFund.id,
      contributorId: afranSeedContributor.id,
      type: TransactionType.DONATION,
      date: new Date(),
      amount: 1200,
      description: "Restricted endowment gift for hack fund",
    },
  });
  await prisma.transaction.create({
    data: {
      organizationId: afransOrg.id,
      fundId: afransHackFund.id,
      contributorId: afranSeedContributor.id,
      type: TransactionType.INVESTMENT,
      date: new Date(),
      amount: 500,
      description: "Endowment investment allocation",
    },
  });

  // Mohamed's Org
  await prisma.transaction.create({
    data: {
      organizationId: mohamedsOrg.id,
      fundId: mohamedsFoodFund.id,
      contributorId: mohamedSeedContributor.id,
      type: TransactionType.DONATION,
      date: new Date(),
      amount: 600,
      description: "Initial endowment gift (unrestricted)",
    },
  });
  await prisma.transaction.create({
    data: {
      organizationId: mohamedsOrg.id,
      fundId: mohamedsFoodFund.id,
      contributorId: mohamedSeedContributor.id,
      type: TransactionType.WITHDRAWAL,
      date: new Date(),
      amount: 150,
      description: "General program withdrawal",
    },
  });

  await prisma.transaction.create({
    data: {
      organizationId: mohamedsOrg.id,
      fundId: mohamedsHackFund.id,
      contributorId: mohamedSeedContributor.id,
      type: TransactionType.DONATION,
      date: new Date(),
      amount: 900,
      description: "Donation for hack activities",
    },
  });
  await prisma.transaction.create({
    data: {
      organizationId: mohamedsOrg.id,
      fundId: mohamedsHackFund.id,
      contributorId: mohamedSeedContributor.id,
      type: TransactionType.EXPENSE,
      date: new Date(),
      amount: 300,
      description: "Hardware + snacks",
    },
  });

  await prisma.fund.update({
    where: { id: afransFoodFund.id },
    data: { amount: 550, units: 0 },
  });
  await prisma.fund.update({
    where: { id: afransHackFund.id },
    data: { amount: 1700, units: 0 },
  });
  await prisma.fund.update({
    where: { id: mohamedsFoodFund.id },
    data: { amount: 450, units: 0 },
  });
  await prisma.fund.update({
    where: { id: mohamedsHackFund.id },
    data: { amount: 600, units: 0 },
  });

  await prisma.organization.update({
    where: { id: afransOrg.id },
    data: { amount: 2250, units: 0 },
  });
  await prisma.organization.update({
    where: { id: mohamedsOrg.id },
    data: { amount: 1050, units: 0 },
  });

  console.log({
    organizations: { afransOrg, mohamedsOrg },
    users: { afranUser, mohamedUser },
    contributors: { afranSeedContributor, mohamedSeedContributor },
    funds: {
      afransFoodFund,
      afransHackFund,
      mohamedsFoodFund,
      mohamedsHackFund,
    },
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
