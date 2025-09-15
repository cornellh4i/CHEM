import { create } from "domain";
import prisma from "../utils/client";
import {
  Fund,
  FundType,
  Transaction,
  Contributor,
  Prisma,
} from "@prisma/client";

// Get all funds with filtering, sorting, and pagination
const getFunds = async (
  filters?: { type?: FundType; restriction?: boolean },
  sort?: { field: "createdAt" | "amount" | "units"; order: "asc" | "desc" },
  pagination?: { skip?: number; take?: number }
): Promise<{ funds: Fund[]; total: number }> => {
  try {
    const where: Prisma.FundWhereInput = {
      type: filters?.type,
      restriction: filters?.restriction,
    };

    const [funds, total] = await prisma.$transaction([
      prisma.fund.findMany({
        where,
        orderBy: sort ? { [sort.field]: sort.order } : undefined,
        skip: pagination?.skip || 0,
        take: pagination?.take || 100,
      }),
      prisma.fund.count({ where }),
    ]);

    return { funds, total };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get funds: ${error.message}`);
    }
    throw new Error("Failed to get funds due to an unknown error");
  }
};

// Get fund by id
const getFundById = async (id: string): Promise<Fund | null> => {
  try {
    return await prisma.fund.findUnique({ where: { id } });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get fund: ${error.message}`);
    }
    throw new Error("Failed to get fund due to an unknown error");
  }
};

// TODO: create new fund

// TODO: update new fund

// TODO: delete new fund - akhil jade
const deleteFundById = async (id: string): Promise<Fund | null> => {
  try {
    const fund = await prisma.fund.findUnique({ where: { id }});
    if (!fund) return null;
    return await prisma.fund.delete({ where: { id }})

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete fund: ${error.message}`);
    }
    throw new Error("Failed to delete fund due to an unknown error");
  }
  
};


// TODO: get all transactions by fund id - akhil jade
const getTransactionsByFundId = async (
  id: string,
  //sort based on either first name, last name, in ascending or descending order
  sort?: {
    field: "date" | "amount";
    order: "asc" | "desc";
  },
  // pagination parameters
  pagination?: { skip?: number; take?: number }
): Promise<{ transactions: Transaction[]; total: number }> => {
  try {
    //Check if fund exists
    const fundExists = await prisma.fund.findUniqueOrThrow({
      where: { id },
      select: { id: true },
    });

    // Use Prisma's transaction to get transactions and total count
    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where: { fundId: id },
        orderBy: sort ? { [sort.field]: sort.order } : undefined, // sorting by field and order
        skip: pagination?.skip || 0, // skip transactions, 0 by default
        take: pagination?.take || 100, // take transactions, 100 by default
      }),
      prisma.transaction.count({ where: { fundId: id } }),
    ]);

    // Return transactions and total count
    return { transactions, total };
  } catch (error) {
    // Throw transactions not found error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Fund not found");
      }
    }
    // Throw a more informative error
    if (error instanceof Error) {
      throw new Error(`Failed to get transactions: ${error.message}`);
    }
    // throw a fund not found error
    throw new Error("Failed to get fund due to an unknown error");
  }
};

/// TODO: get all contributors by fund id

export default {
  getFunds,
  getFundById,
  getTransactionsByFundId,
  deleteFundById
};
