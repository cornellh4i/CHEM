import prisma from "../utils/client";
import { Transaction, Prisma, TransactionType } from "@prisma/client";

// Add filter, sort, pagination type interfaces
interface SortOptions {
  field: "date" | "amount";
  order: "asc" | "desc";
}

interface PaginationOptions {
  skip?: number;
  take?: number;
}

/**
 * Retrieves a list of transactions based on provided filters, sorting, and
 * pagination options.
 *
 * @param filters - An object containing optional filters:
 *
 *   - `type` (string): Filters transactions by type (e.g., DONATION, WITHDRAWAL).
 *   - `organizationId` (string): Filters transactions by a specific organization
 *       ID.
 *   - `startDate` (string): Filters transactions that occurred on or after this
 *       date.
 *   - `endDate` (string): Filters transactions that occurred on or before this
 *       date.
 *
 * @param sort - Optional sorting options:
 *
 *   - `field` (string): The field to sort by (e.g., "date", "amount").
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
 *   - `transactions` (array): A list of transactions matching the filters.
 *   - `total` (number): The total count of matching transactions.
 */
async function getTransactions(
  filters: {
    type?: string;
    organizationId?: string;
    startDate?: string;
    endDate?: string;
  },
  sort?: SortOptions,
  pagination?: PaginationOptions
) {
  const where: Prisma.TransactionWhereInput = {};

  if (filters.type) {
    where.type = filters.type as TransactionType;
  }

  if (filters.organizationId) {
    where.organizationId = filters.organizationId;
  }

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) {
      where.date.gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      where.date.lte = new Date(filters.endDate);
    }
  }

  const orderBy = sort ? { [sort.field]: sort.order } : undefined;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip: pagination?.skip,
      take: pagination?.take,
      orderBy,
      include: {
        organization: true,
        contributor: true,
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  return { transactions, total };
}

/**
 * Retrieves a specific transaction by its unique ID.
 *
 * @param id - The unique identifier of the transaction to retrieve.
 * @returns A Promise resolving to the transaction object if found, otherwise
 *   `null`.
 */
async function getTransactionById(id: string) {
  return prisma.transaction.findUnique({
    where: { id },
  });
}

/**
 * Validates a transaction object to ensure required fields are present and
 * valid.
 *
 * @returns Returns an error message string if validation fails, otherwise null.
 */
const ensureValidTransaction = (data: any) => {
  const { organizationId, contributorId, type, date, amount, units } = data;
  if (typeof amount !== "number" || amount <= 0) {
    return "Invalid or missing amount. Must be a positive number.";
  }
  if (units !== undefined && (typeof units !== "number" || units < 0)) {
    return "Invalid units. Must be a non-negative number.";
  }

  return null;
};

/**
 * Creates a new transaction in the database after performing necessary
 * validations.
 *
 * @returns The created transaction object.
 * @throws If validation fails, the organization or contributor does not exist,
 *   the contributor does not belong to the specified organization, or the
 *   transaction type is invalid.
 */
const createTransaction = async (
  transactionData: Omit<Transaction, "id" | "createdAt" | "updatedAt">
): Promise<Transaction> => {
  try {
    const validationError = ensureValidTransaction(transactionData);
    if (validationError) {
      throw new Error(validationError);
    }

    // Validate organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: transactionData.organizationId },
    });
    if (!organization) {
      throw new Error("Organization not found.");
    }

    // Validate contributor exists
    if (transactionData.contributorId) {
      const contributor = await prisma.contributor.findUnique({
        where: { id: transactionData.contributorId },
      });
      if (
        !contributor ||
        contributor.organizationId !== transactionData.organizationId
      ) {
        throw new Error(
          "Contributor not found or does not belong to the given organization."
        );
      }
    }
    // Validate transaction type
    if (
      !Object.values(TransactionType).includes(
        transactionData.type as TransactionType
      )
    ) {
      throw new Error(`Invalid transaction type: ${transactionData.type}`);
    }

    const validData: Prisma.TransactionCreateInput = {
      organization: { connect: { id: transactionData.organizationId } },
      contributor: transactionData.contributorId
        ? { connect: { id: transactionData.contributorId } }
        : undefined,
      type: transactionData.type as TransactionType,
      date: new Date(transactionData.date),
      amount: transactionData.amount,
      units: transactionData.units || undefined,
      description: transactionData.description || undefined,
    };

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: validData,
    });

    // Determine whether to add or subtract the amount/units based on type
    const amountUpdate = 
    // Add the amount to organization if donation or investment; subtract if 
    // otherwise (withdrawal, expense)
      transactionData.type === "DONATION" || transactionData.type === "INVESTMENT"
        ? { increment: transactionData.amount }
        : { decrement: transactionData.amount };
    
    const unitsUpdate =
      transactionData.units !== undefined
        ? transactionData.type === "DONATION" || transactionData.type === "INVESTMENT"
          ? { increment: transactionData.amount }
          : { decrement: transactionData.amount }
        : undefined; // Don't update if units aren't found

    
    // Update the organization's amount and units
    await prisma.organization.update({
      where: { id: transactionData.organizationId },
      data: {
        amount: amountUpdate,
        units: unitsUpdate,
      },
    })
    
    return transaction;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
    throw new Error("Failed to create transaction due to an unknown error.");
  }
};

/**
 * Updates an existing transaction in the database with new data.
 *
 * @returns A Promise resolving to the updated transaction object.
 * @throws If the transaction with the given ID does not exist or if the update
 *   fails.
 */
async function updateTransaction(
  id: string,
  data: Prisma.TransactionUpdateInput
) {
  return prisma.transaction.update({
    where: { id },
    data,
  });
}

/**
 * Deletes a transaction from the database and updates the associated
 * organization's financial data accordingly.
 *
 * @returns The deleted transaction object.
 * @throws If the transaction is not found, if the deletion fails, or if an
 *   unknown error occurs.
 */
const deleteTransaction = async (id: string): Promise<Transaction> => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new Error("Unable to locate transaction");
    }
    // update the associated organization's totals (units & amounts, based on transaction type)
    const amountUpdated = transaction.type === "DONATION" || transaction.type === "INVESTMENT" ? {decrement: transaction.amount} : {increment: transaction.amount};
    const unitsUpdated = transaction.units ? transaction.type === "DONATION" || transaction.type === "INVESTMENT" ? {decrement: transaction.units} : {increment: transaction.units}: undefined;

    if (transaction.organizationId) {
      await prisma.organization.update({
        where: { id: transaction.organizationId },
        data: {
          amount: amountUpdated,
          units: unitsUpdated,
        },
      });
    }

    // Delete the transaction
    const deletedTransaction = await prisma.transaction.delete({
      where: { id },
    });
    // Return the deleted transaction
    return deletedTransaction;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Transaction not found.");
      }
    }
    if (error instanceof Error) {
      throw new Error(`Unable to delete transaction: ${error.message}`);
    }
    throw new Error("Unable to delete transaction due to an unknown error.");
  }
};

/**
 * Retrieves all transactions for a specific organization with optional filtering,
 * sorting, and pagination.
 *
 * @returns An object containing the transactions array and total count.
 * @throws If the organization does not exist, if query parameters are invalid,
 *   or if an unexpected error occurs.
 */
const getOrganizationTransactions = async (
  id: string,
  filter?: {
    type?: TransactionType;
    startDate?: Date;
    endDate?: Date;
    contributorId?: string;
  },
  sort?: {
    field: "date" | "amount" | "units";
    order: "asc" | "desc";
  },
  pagination?: { skip?: number; take?: number }
  
): Promise<{ transactions: Transaction[]; total: number }> => {
  try {
    // Validate organization exists
    const organization = await prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    // Construct the where clause for filtering
    const where: Prisma.TransactionWhereInput = {
      organizationId: id,
      ...(filter?.type && { type: filter.type }), 
      ...(filter?.contributorId && { contributorId: filter.contributorId }),
      ...((filter?.startDate || filter?.endDate) && {
        date: {
          ...(filter.startDate && { gte: filter.startDate }),
          ...(filter.endDate && { lte: filter.endDate }),
        },
      }),
    };  
    // Get transactions and total count/number of transactions
    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        orderBy: sort ? { [sort.field]: sort.order } : undefined,
        skip: pagination?.skip || 0, 
        take: pagination?.take || 100, 
        include: {
          contributor: true, // Include contributor details
        }
      }),
      prisma.transaction.count({ where }), // Total count of transactions
    ]);

    // Return transactions and total count
    return { transactions, total };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Organization not found.");
      }
    }
    if (error instanceof Error) {
      throw new Error(`Unable to get transactions: ${error.message}`);
    }
    throw new Error("Unable to get transaction due to an unknown error.");
  }
};


/**
 * Retrieves all transactions for a specific contributor with optional filtering,
 * sorting, and pagination.
 *
 * @returns An object containing the transactions array and total count.
 * @throws If the contributor does not exist, if query parameters are invalid,
 *   or if an unexpected error occurs.
 */
async function getContributorTransactions(contributorId: string, filters: {
  type?: string;
  organizationId?: string;
  startDate?: string;
  endDate?: string;
},
sort?: SortOptions,
pagination?: PaginationOptions
) {
  //Validate contributor exists
  const contributor = await prisma.contributor.findUnique({
    where: { id: contributorId}, 
    select: {id: true} ,
  });
  if (!contributor) {
    //contributor not found = 404
    throw new Error("Contributor not found.");
  }
  //setting up the filter
  const where: Prisma.TransactionWhereInput = { contributorId};

  if (filters.type) {
    where.type = filters.type as TransactionType;
  }

  if (filters.organizationId) {
    where.organizationId = filters.organizationId;
    const organization = await prisma.contributor.findUnique({
      where: { id: filters.organizationId}, 
      select: {id: true} ,
    });
    if (!organization) {
      //organization not found = 404
      throw new Error("Organization not found.");
    }
  }

  if (filters.startDate || filters.endDate) {
    where.date = {};
    try {
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.date.lte = new Date(filters.endDate);
      }
    }
    catch (e){
      //Invalid Query Input
      throw new Error("Invalid Date Format.")
    }
  }

  const orderBy = sort ? { [sort.field]: sort.order } : undefined;
  //actual query
  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip: pagination?.skip,
      take: pagination?.take,
      orderBy,
    }),
    prisma.transaction.count({ where }),
  ]);

  return { transactions, total };
}

// TODO: get all transactions for a specific fund getFundTransactions

export default {
  createTransaction,
  deleteTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  getOrganizationTransactions,
  getContributorTransactions,
};
