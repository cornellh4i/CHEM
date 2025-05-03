// controllers/funds.js
import prisma from "../utils/client";
import { Fund, Prisma, FundType } from "@prisma/client";

/**
 * Retrieves a list of funds based on provided filters, sorting, and pagination
 * options.
 *
 * @param filters - An object containing optional filters:
 *
 *   - `type` (string): Filters funds by type (e.g., ENDOWMENT, DONATION).
 *   - `organizationId` (string): Filters funds by a specific organization ID.
 *
 * @param sort - Optional sorting options:
 *
 *   - `field` (string): The field to sort by (e.g., "createdAt", "amount").
 *   - `order` (string): The sorting order ("asc" for ascending, "desc" for
 *       descending).
 *
 * @param pagination - Optional pagination options:
 *
 *   - `skip` (number): The number of records to skip.
 *   - `take` (number): The number of records to return.
 *
 * @returns A Promise resolving to an object containing:
 *
 *   - `funds` (array): A list of funds matching the filters.
 *   - `total` (number): The total count of matching funds.
 */
async function getFunds(
  filters: {
    type?: string;
    organizationId?: string;
  },
  sort?: {
    field: "createdAt" | "amount";
    order: "asc" | "desc";
  },
  pagination?: {
    skip?: number;
    take?: number;
  }
) {
  const where: Prisma.FundWhereInput = {};

  if (filters.type) {
    where.type = filters.type as FundType;
  }

  if (filters.organizationId) {
    where.organizationId = filters.organizationId;
  }

  const orderBy = sort ? { [sort.field]: sort.order } : undefined;

  const [funds, total] = await Promise.all([
    prisma.fund.findMany({
      where,
      skip: pagination?.skip,
      take: pagination?.take,
      orderBy,
      include: {
        organization: true,
      },
    }),
    prisma.fund.count({ where }),
  ]);

  return { funds, total };
}

/**
 * Retrieves a specific fund by its unique ID.
 *
 * @param id - The unique identifier of the fund to retrieve.
 * @returns A Promise resolving to the fund object if found, otherwise `null`.
 */
async function getFundById(id: string) {
  return prisma.fund.findUnique({
    where: { id },
    include: {
      organization: true,
    },
  });
}

/**
 * Retrieves all transactions for a specific fund with optional filtering,
 * sorting, and pagination.
 *
 * @param id - The fund ID.
 * @param filters - Optional filters.
 * @param sort - Optional sorting parameters.
 * @param pagination - Optional pagination parameters.
 * @returns An object containing the transactions array and total count.
 * @throws If the fund does not exist or an unexpected error occurs.
 */
async function getFundTransactions(
  id: string,
  filters?: {
    type?: string;
    startDate?: Date;
    endDate?: Date;
    contributorId?: string;
  },
  sort?: {
    field: "date" | "amount" | "units";
    order: "asc" | "desc";
  },
  pagination?: { skip?: number; take?: number }
) {
  try {
    // Validate fund exists
    const fund = await prisma.fund.findUnique({
      where: { id },
    });

    if (!fund) {
      throw new Error("Fund not found");
    }

    // Construct where clause for filtering
    const where: Prisma.TransactionWhereInput = {
      fundId: id,
    };

    // Add additional filters if provided
    if (filters?.type) {
      where.type = filters.type as any;
    }

    if (filters?.contributorId) {
      where.contributorId = filters.contributorId;
    }

    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    // Get transactions and total count
    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        orderBy: sort ? { [sort.field]: sort.order } : undefined,
        skip: pagination?.skip || 0,
        take: pagination?.take || 100,
        include: {
          contributor: true,
          organization: true,
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    return { transactions, total };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get fund transactions: ${error.message}`);
    }
    throw new Error("Failed to get fund transactions due to an unknown error.");
  }
}

/**
 * Retrieves all contributors for a specific fund with optional filtering,
 * sorting, and pagination.
 *
 * @param id - The fund ID.
 * @param sort - Optional sorting parameters.
 * @param pagination - Optional pagination parameters.
 * @returns An object containing the contributors array and total count.
 * @throws If the fund does not exist or an unexpected error occurs.
 */
async function getFundContributors(
  id: string,
  sort?: {
    field: "firstName" | "lastName" | "createdAt";
    order: "asc" | "desc";
  },
  pagination?: { skip?: number; take?: number }
) {
  try {
    // Validate fund exists
    const fund = await prisma.fund.findUnique({
      where: { id },
      include: { contributors: true },
    });

    if (!fund) {
      throw new Error("Fund not found");
    }

    // Get contributors associated with this fund and total count
    const [contributors, total] = await prisma.$transaction([
      prisma.contributor.findMany({
        where: {
          funds: {
            some: {
              id,
            },
          },
        },
        orderBy: sort ? { [sort.field]: sort.order } : undefined,
        skip: pagination?.skip || 0,
        take: pagination?.take || 100,
      }),
      prisma.contributor.count({
        where: {
          funds: {
            some: {
              id,
            },
          },
        },
      }),
    ]);

    return { contributors, total };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get fund contributors: ${error.message}`);
    }
    throw new Error("Failed to get fund contributors due to an unknown error.");
  }
}

export default {
  getFunds,
  getFundById,
  getFundTransactions,
  getFundContributors,
};
