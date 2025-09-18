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

// TODO: create new fund, Krish & Johnny
const createFund = async (
  data: Omit<Fund, "id" | "createdAt" | "updatedAt">
): Promise<Fund> => {
  try {
    // Ensure organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: data.organizationId },
    });
    if (!organization) {
      throw new Error("Organization not found");
    }

    // Validate fund type
    if (!Object.values(FundType).includes(data.type as FundType)) {
      throw new Error(`Invalid fund type: ${data.type}`);
    }

    const validData: Prisma.FundCreateInput = {
      organization: { connect: { id: data.organizationId } },
      type: data.type,
      restriction:
        data.restriction === undefined ? undefined : data.restriction,
      units: data.units || undefined,
      amount: data.amount || 0,
    };

    const fund = await prisma.fund.create({ data: validData });
    return fund;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("A fund with the provided data already exists");
      }
    }
    if (error instanceof Error) {
      throw new Error(`Failed to create fund: ${error.message}`);
    }
    throw new Error("Failed to create fund due to an unknown error");
  }
};

// Update an existing fund
const updateFund = async (
  id: string,
  fundData: Partial<Omit<Fund, "id" | "createdAt" | "updatedAt">>
): Promise<Fund> => {
  try {
    // If organizationId is provided, ensure that organization exists
    if (fundData.organizationId) {
      const organization = await prisma.organization.findUnique({
        where: { id: fundData.organizationId },
      });
      if (!organization) {
        throw new Error("Organization not found");
      }
    }

    const data: Prisma.FundUpdateInput = {
      ...(fundData.type && { type: fundData.type }),
      ...(fundData.restriction !== undefined && {
        restriction: fundData.restriction,
      }),
      ...(fundData.units !== undefined && { units: fundData.units }),
      ...(fundData.amount !== undefined && { amount: fundData.amount }),
      ...(fundData.organizationId && {
        organization: { connect: { id: fundData.organizationId } },
      }),
    };

    const updatedFund = await prisma.fund.update({ where: { id }, data });
    return updatedFund;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Fund not found");
      }
    }
    if (error instanceof Error) {
      throw new Error(`Failed to update fund: ${error.message}`);
    }
    throw new Error("Failed to update fund due to an unknown error");
  }
};

const deleteFundById = async (id: string): Promise<Fund | null> => {
  try {
    const fund = await prisma.fund.findUnique({ where: { id } });
    // check if fund exists
    if (!fund) return null;

    // delete related transactions
    await prisma.transaction.deleteMany({
      where: { fundId: id },
    });

    // delete fund
    return await prisma.fund.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete fund: ${error.message}`);
    }
    throw new Error("Failed to delete fund due to an unknown error");
  }
};

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

/// TODO: get all contributors by fund id, Krish & Johnny
const getContributorsByFundId = async (
  id: string,
  sort?: {
    field: "firstName" | "lastName";
    order: "asc" | "desc";
  },
  pagination?: { skip?: number; take?: number }
): Promise<{ contributors: Contributor[]; total: number }> => {
  try {
    // Ensure fund exists
    await prisma.fund.findUniqueOrThrow({
      where: { id },
      select: { id: true },
    });

    const where: Prisma.ContributorWhereInput = {
      funds: { some: { id } },
    };

    const [contributors, total] = await prisma.$transaction([
      prisma.contributor.findMany({
        where,
        orderBy: sort ? { [sort.field]: sort.order } : undefined,
        skip: pagination?.skip || 0,
        take: pagination?.take || 100,
        include: { organization: true },
      }),
      prisma.contributor.count({ where }),
    ]);

    return { contributors, total };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Fund not found");
      }
    }
    if (error instanceof Error) {
      throw new Error(`Failed to get contributors: ${error.message}`);
    }
    throw new Error("Failed to get contributors due to an unknown error");
  }
};

export default {
  getFunds,
  getFundById,
  createFund,
  updateFund,
  getTransactionsByFundId,
  deleteFundById,
  getContributorsByFundId,
};
