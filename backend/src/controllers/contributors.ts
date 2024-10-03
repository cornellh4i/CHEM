// controllers/contributors.ts
import prisma from "../utils/client";
import { Contributor } from "@prisma/client";

const getContributors = async (): Promise<Contributor[]> => {
  // TODO: Implement get contributors logic
  // This should include handling filters, sorting, and pagination
  throw new Error("getContributors method not implemented");
};

const getContributorById = async (id: string): Promise<Contributor | null> => {
  try {
    // find unique id from prisma
    const contributor = await prisma.contributor.findUnique({
      where: { id },
    });
    return contributor;
    // else error finding
  } catch (error) {
    throw new Error("Error fetching contributor by ID");
  }
};

const createContributor = async (
  contributorData: Omit<Contributor, "id" | "createdAt" | "updatedAt">
): Promise<Contributor> => {
  // TODO: Implement create contributor logic
  throw new Error("createContributor method not implemented");
};

const updateContributor = async (
  id: string,
  contributorData: Partial<Omit<Contributor, "id" | "createdAt" | "updatedAt">>
): Promise<Contributor> => {
  // TODO: Implement update contributor logic
  throw new Error("updateContributor method not implemented");
};

const deleteContributor = async (id: string): Promise<void> => {
  // TODO: Implement delete contributor logic
  throw new Error("deleteContributor method not implemented");
};

export default {
  getContributors,
  getContributorById,
  createContributor,
  updateContributor,
  deleteContributor,
};
