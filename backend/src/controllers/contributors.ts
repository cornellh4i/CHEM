import prisma from "../utils/client";
import { Contributor, Prisma } from "@prisma/client";

// Get contributors with filtering, sorting, and pagination
const getContributors = async (
  filters?: { firstName?: string; lastName?: string; organizationId?: string },
  sort?: {
    field: "firstName" | "lastName" | "createdAt";
    order: "asc" | "desc";
  },
  pagination?: { skip?: number; take?: number }
): Promise<{ contributors: Contributor[]; total: number }> => {
  try {
    const where: Prisma.ContributorWhereInput = {
      firstName: filters?.firstName
        ? { contains: filters.firstName, mode: "insensitive" }
        : undefined,
      lastName: filters?.lastName
        ? { contains: filters.lastName, mode: "insensitive" }
        : undefined,
      organizationId: filters?.organizationId,
    };

    const [contributors, total] = await prisma.$transaction([
      prisma.contributor.findMany({
        where,
        orderBy: sort ? { [sort.field]: sort.order } : undefined,
        skip: pagination?.skip || 0,
        take: pagination?.take || 100,
      }),
      prisma.contributor.count({ where }),
    ]);

    return { contributors, total };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get contributors: ${error.message}`);
    }
    throw new Error("Failed to get contributors due to an unknown error");
  }
};

const getContributorById = async (id: string): Promise<Contributor | null> => {
  try {
    const contributor = await prisma.contributor.findUnique({
      where: { id },
    });
    return contributor;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching contributor by ID: ${error.message}`);
    }
    throw new Error("Error fetching contributor by ID due to an unknown error");
  }
};

const createContributor = async (
  contributorData: Omit<Contributor, "id" | "createdAt" | "updatedAt">
): Promise<Contributor> => {
  try {
    const contributor = await prisma.contributor.create({
      data: contributorData,
    });
    return contributor;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error(
          "A contributor with this name already exists in this organization"
        );
      }
    }
    if (error instanceof Error) {
      throw new Error(`Failed to create a contributor: ${error.message}`);
    }
    throw new Error("Failed to create a contributor due to an unknown error");
  }
};

const updateContributor = async (
  id: string,
  contributorData: Partial<Omit<Contributor, "id" | "createdAt" | "updatedAt">>
): Promise<Contributor> => {
  try {
    const updatedContributor = await prisma.contributor.update({
      where: { id },
      data: contributorData,
    });
    return updatedContributor;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Contributor not found");
      }
    }
    if (error instanceof Error) {
      throw new Error(`Failed to update the contributor: ${error.message}`);
    }
    throw new Error("Failed to update the contributor due to an unknown error");
  }
};

const deleteContributor = async (id: string): Promise<Contributor> => {
  try {
    const contributor = await prisma.contributor.delete({ where: { id } });
    return contributor;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Contributor not found");
      }
    }
    if (error instanceof Error) {
      throw new Error(`Failed to delete contributor: ${error.message}`);
    }
    throw new Error("Failed to delete contributor due to an unknown error");
  }
};

// TODO: getContributorTransactions
const getContributorTransactions = async (
  contributorId: string
): Promise<number[]> => {
  try {
    // Define the specific type for the selected field
    type TransactionAmount = { amount: number };

    // Fetch only the 'amount' of each transaction, sorted by 'date' in ascending order
    const transactions: TransactionAmount[] = await prisma.transaction.findMany(
      {
        where: {
          contributorId,
        },
        select: {
          amount: true,
        },
        orderBy: {
          date: "asc",
        },
      }
    );

    // Extract and return the list of amounts
    return transactions.map((transaction) => transaction.amount);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get transactions: ${error.message}`);
    }
    throw new Error("Failed to get transactions due to an unknown error");
  }
};

export default {
  getContributors,
  getContributorById,
  createContributor,
  updateContributor,
  deleteContributor,
  getContributorTransactions,
};
