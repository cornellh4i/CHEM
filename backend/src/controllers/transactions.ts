import prisma from "../utils/client";
import { Transaction, Prisma, TransactionType } from "@prisma/client";
// Filter interface for transactions
interface TransactionFilters {
  type?: TransactionType;
  dateFrom?: Date;
  dateTo?: Date;
  organizationId?: string;
}

// Sort interface for transactions
interface TransactionSort {
  field: "date" | "amount";
  order: Prisma.SortOrder;
}

// Pagination interface
interface PaginationParams {
  skip?: number;
  take?: number;
}

// Get transactions with filtering, sorting, and pagination
const getTransactions = async (
  filters?: TransactionFilters,
  sort?: TransactionSort,
  pagination?: PaginationParams
): Promise<{ transactions: Transaction[]; total: number }> => {
  try {
    const where: Prisma.TransactionWhereInput = {};

    if (filters) {
      if (filters.type) where.type = filters.type;
      if (filters.organizationId) where.organizationId = filters.organizationId;
      if (filters.dateFrom || filters.dateTo) {
        where.date = {};
        if (filters.dateFrom) where.date.gte = filters.dateFrom;
        if (filters.dateTo) where.date.lte = filters.dateTo;
      }
    }

    const orderBy = sort
      ? { [sort.field]: sort.order }
      : { date: Prisma.SortOrder.desc };

    const skip = pagination?.skip || 0;
    const take = pagination?.take || 100;

    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.transaction.count({ where }),
    ]);

    return { transactions, total };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get transactions: ${error.message}`);
    }
    throw new Error("Failed to get transactions due to an unknown error");
  }
};

// Get a single transaction by ID
const getTransactionById = async (id: string): Promise<Transaction | null> => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });
    return transaction;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching transaction by ID: ${error.message}`);
    }
    throw new Error("Error fetching transaction by ID due to an unknown error");
  }
};

// TODO: Implement createTransaction function

// Update a transaction
const updateTransaction = async (
  id: string,
  data: Prisma.TransactionUpdateInput
): Promise<Transaction> => {
  try {
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data,
    });
    return updatedTransaction;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Transaction not found");
      }
    }
    if (error instanceof Error) {
      throw new Error(`Failed to update transaction: ${error.message}`);
    }
    throw new Error("Failed to update transaction due to an unknown error");
  }
};

// TODO: Implement deleteTransaction function

/* TODO: Add getOrganizationTransactions function
 * Should return all transactions for an organization
 * Include filtering by:
 *  - type (DONATION, WITHDRAWAL, etc)
 *  - date range
 *  - contributorId
 * Include sorting by date and amount
 * Include pagination support
 * Handle case where organization doesn't exist
 * Must check organization exists before querying transactions
 * Return transactions array and total count
 */

/* TODO: Add getContributorTransactions function
 * Should return all transactions for a contributor
 * Include filtering by:
 *  - type (DONATION, WITHDRAWAL, etc)
 *  - date range
 *  - organizationId
 * Include sorting by date and amount
 * Include pagination support
 * Handle case where contributor doesn't exist
 * Must check contributor exists before querying transactions
 * Return transactions array and total count
 */

export default { getTransactions, getTransactionById, updateTransaction };
