import prisma from "../utils/client";
import { Contributor, Prisma } from "@prisma/client";

/**
 * Retrieves a list of contributors based on optional filters, sorting, and
 * pagination. Filters by FirstName / lastName, OrganizationId, FundId. Sort by
 * firstName, lastName, or createdAt (asc/desc). Pagination include skipping and
 * how many to return. Returns array of matched Contributor records with related
 * orgs, funds, and transactions and total count of matching contributors
 */
const getContributors = async (
  filters?: {
    firstName?: string;
    lastName?: string;
    organizationId?: string;
    fundId?: string;
  },
  sort?: {
    field: "firstName" | "lastName" | "createdAt";
    order: "asc" | "desc";
  },
  pagination?: { skip?: number; take?: number }
): Promise<{ contributors: Contributor[]; total: number }> => {
  try {
    // Build dynamic filtering conditions
    const where: Prisma.ContributorWhereInput = {
      // Case-insensitive filter for first name
      firstName: filters?.firstName
        ? { contains: filters.firstName, mode: "insensitive" }
        : undefined,
      // Case-insensitive filter for last name
      lastName: filters?.lastName
        ? { contains: filters.lastName, mode: "insensitive" }
        : undefined,
      // Filter contributors associated with a specific organization
      organization: filters?.organizationId
        ? {
            some: {
              id: filters.organizationId,
            },
          }
        : undefined,
      // Filter contributors who are linked to a specific fund
      funds: filters?.fundId
        ? {
            some: {
              id: filters.fundId,
            },
          }
        : undefined,
    };
    // Run both the query and count in a transaction for consistency
    const [contributors, total] = await prisma.$transaction([
      prisma.contributor.findMany({
        where,
        // Optional sorting (by firstName, lastName, or createdAt)
        orderBy: sort ? { [sort.field]: sort.order } : undefined,
        skip: pagination?.skip || 0,
        take: pagination?.take || 100,
        include: {
          organization: true, // Include related organizations
          transactions: true, // Include related transactions
          funds: true, // Include related funds
        },
      }),
      prisma.contributor.count({ where }), // Get total count
    ]);
    return { contributors, total };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch contributors");
  }
};

/**
 * Retrieves a contributor by their unique ID.
 *
 * @param {string} id - The ID of the contributor to retrieve.
 * @returns {Promise<Contributor | null>} The contributor if found, otherwise
 *   null.
 * @throws {Error} If the contributor cannot be fetched.
 */
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

/**
 * Creates a new contributor in the database.
 *
 * @param contributorData - Contributor data excluding auto-generated fields
 *   (`id`, `createdAt`, `updatedAt`)
 * @returns The newly created contributor object
 * @throws Error if contributor creation fails
 */
const createContributor = async (
  contributorData: Omit<Contributor, "id" | "createdAt" | "updatedAt">
): Promise<Contributor> => {
  try {
    const contributor = await prisma.contributor.create({
      data: contributorData,
    });
    return contributor;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create a contributor: ${error.message}`);
    }
    throw new Error("Failed to create a contributor due to an unknown error");
  }
};

/**
 * Updates an existing contributor in the database by ID.
 *
 * @param id - The ID of the contributor to update
 * @param contributorData - A partial object containing the fields to update,
 *   excluding `id`, `createdAt`, and `updatedAt`
 * @returns The updated contributor object
 * @throws Error if the contributor is not found or if the update fails
 */
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

/**
 * Deletes a contributor from the database by their ID.
 *
 * @param id - The unique ID of the contributor to be deleted
 * @returns The deleted contributor object
 * @throws Error if the contributor does not exist or deletion fails
 */
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

/**
 * Retrieves a list of transaction amounts for a specific contributor.
 *
 * @param contributorId - The unique ID of the contributor
 * @returns An array of transaction amounts (in ascending order by date)
 * @throws Error if the transactions cannot be fetched
 */
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
