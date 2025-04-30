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

// Create new fund
const createFund = async (
    fundData: Omit<Fund, "id" | "createdAt" | "updatedAt">
  ): Promise<Fund> => {
    try {
      const newFund = await prisma.fund.create({
        data: fundData,
      });
      return newFund;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create fund: ${error.message}`);
      }
      throw new Error("Failed to create fund due to an unknown error");
    }
  };

// Update new fund
const updateFund = async (
    id: string,
    fundData: Partial<Omit<Fund, "id" | "createdAt" | "updatedAt">>
  ): Promise<Fund> => {
    try {
      const updatedFund = await prisma.fund.update({
        where: { id },
        data: fundData,
      });
      return updatedFund;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new Error("Fund not found");
      }
      if (error instanceof Error) {
        throw new Error(`Failed to update fund: ${error.message}`);
      }
      throw new Error("Failed to update fund due to an unknown error");
    }
  };

// TODO: delete new fund

// TODO: get all transactions by fund id

/// TODO: get all contributors by fund id

export default {
    getFunds,
    getFundById,
    createFund,
    updateFund,
};
