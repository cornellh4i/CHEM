import prisma from "../utils/client";
import { Contributor } from "@prisma/client";

// TODO: get all funds

// TODO: get fund by id

// TODO: create new fund

// TODO: update new fund

// TODO: delete new fund

// TODO: get all transactions by fund id
const getFundTransactions = async (
  fundId: string,
  sort?: {
    field: "date" | "amount";
    order: "asc" | "desc";
  },
  pagination?: { skip?: number; take?: number }
): Promise<number[]> => {
  try {
    type TransactionAmount = { amount: number };
    const transactions: TransactionAmount[] = await prisma.transaction.findMany(
      {
        where: {
          fundId,
        },
        select: {
          amount: true,
        },
        orderBy: sort ? { [sort.field]: sort.order } : { date: "asc" }, // sorting by field and order
      }
    );
    return transactions.map((transaction) => transaction.amount);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get transactions: ${error.message}`);
    }
    throw new Error("Failed to get transactions due to an unknown error");
  }
};

/// TODO: get all contributors by fund id
const getFundContributors = async (
  fundId: string,
  sort?: {
    field: "firstName" | "lastName";
    order: "asc" | "desc";
  },
  pagination?: { skip?: number; take?: number }
): Promise<{ contributors: Contributor[]; total: number }> => {
  try {
    const fundExists = await prisma.fund.findUniqueOrThrow({
      where: { id: fundId },
      select: { id: true },
    });
    const [contributors, total] = await prisma.$transaction([
      prisma.contributor.findMany({
        where: {
          funds: {
            some: {
              id: fundId,
            },
          },
        },
        orderBy: sort ? { [sort.field]: sort.order } : undefined, // sorting by field and order
        skip: pagination?.skip || 0, // skip organizations, 0 by default
        take: pagination?.take || 100, // take organizations, 100 by default
      }),
      prisma.contributor.count({
        where: {
          funds: {
            some: {
              id: fundId,
            },
          },
        },
      }),
    ]);
    return { contributors, total };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get contributors: ${error.message}`);
    }
    throw new Error("Failed to get contributors due to an unknown error");
  }
};

export default { getFundTransactions, getFundContributors };
