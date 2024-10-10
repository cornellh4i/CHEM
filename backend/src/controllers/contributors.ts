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
  //Error Handling
  try {
    //Attempts to create a contributor
    const contributor = await prisma.contributor.create({
      data: contributorData,
    });
    return contributor;
    //There was a problem creating a contributor so throw an error
  } catch (error) {
    console.error("Error creating contributor:", error);
    throw new Error(`Failed to create a contributor: ${error}`);
  }
};

const updateContributor = async (
  id: string,
  contributorData: Partial<Omit<Contributor, "id" | "createdAt" | "updatedAt">>
): Promise<Contributor> => {
  //Error Handling
  try {
    //Attempts to update the contributor with new data
    const newContributor = await prisma.contributor.update({
      where: { id: id },
      data: contributorData,
    });
    //Returns the new updated contributor
    return newContributor;
    //There was a problem updating the contributor so thrown an error
  } catch (error) {
    console.error("Error updating contributor:", error);
    throw new Error(`Failed to update the contributor: ${error}`);
  }
};

const deleteContributor = async (id: string): Promise<Contributor> => {
  // TODO: Implement delete contributor logic
  try {
    const contributor = await prisma.contributor.delete({ where: { id } });
    return contributor;
  } catch (error) {
    //this allows us to propagate Prisma's error message
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Couldn't delete use");
    }
  }
};

export default {
  getContributors,
  getContributorById,
  createContributor,
  updateContributor,
  deleteContributor,
};
