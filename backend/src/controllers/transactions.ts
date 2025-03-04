import prisma from "../utils/client";
import { Transaction, Prisma, TransactionType } from "@prisma/client";

interface SortOptions {
  field: "date" | "amount";
  order: "asc" | "desc";
}

interface PaginationOptions {
  skip?: number;
  take?: number;
}

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
    }),
    prisma.transaction.count({ where }),
  ]);

  return { transactions, total };
}

async function getTransactionById(id: string) {
  return prisma.transaction.findUnique({
    where: { id },
  });
}

async function updateTransaction(
  id: string,
  data: Prisma.TransactionUpdateInput
) {
  return prisma.transaction.update({
    where: { id },
    data,
  });
}

export default {
  getTransactions,
  getTransactionById,
  updateTransaction,
};
