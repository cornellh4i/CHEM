import prisma from "../utils/client";
import { Transaction, Prisma, TransactionType } from "@prisma/client";

// TODO: Add filter, sort, pagination type interfaces

// TODO: Implement getTransactions function

// TODO: Implement getTransactionById function

// TODO: Implement createTransaction function
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
  
      const validData: Prisma.TransactionCreateInput = {
        organization: { connect: { id: transactionData.organizationId } },
        contributor: transactionData.contributorId
          ? { connect: { id: transactionData.contributorId } }
          : undefined,
        type: transactionData.type,
        date: new Date(transactionData.date),
        amount: transactionData.amount,
        units: transactionData.units || undefined,
        description: transactionData.description || undefined,
      };
  
      // Create transaction
      const transaction = await prisma.transaction.create({
        data: validData,
      });
  
      return transaction;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create transaction: ${error.message}`);
      }
      throw new Error("Failed to create transaction due to an unknown error.");
    }
  };

// TODO: Implement updateTransaction function

// TODO: Implement deleteTransaction function
const deleteTransaction = async (id: string): Promise<Transaction> => {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id },
      });
  
      if (!transaction) {
        throw new Error("Unable to locate transaction");
      }
      if (transaction.organizationId) {
        await prisma.organization.update({
          where: { id: transaction.organizationId },
          data: {
            amount: {
              decrement: transaction.amount,
            },
            units: transaction.units
              ? {
                  decrement: transaction.units,
                }
              : undefined,
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

export default {
    createTransaction,
    deleteTransaction,
  };
