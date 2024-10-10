// controllers/organizations.ts
import prisma from "../utils/client";
import { Organization } from "@prisma/client";

const getOrganizations = async (
  //filter based on name, restriction, and type
  filters?: { name?: string; restriction?: string; type?: string },
  //sort based on either name, date, units, or amount in ascending or descending order
  sort?: {
    field: "name" | "createdAt" | "units" | "amount";
    order: "asc" | "desc";
  },
  //pagination parameters
  pagination?: { skip?: number; take?: number }
): Promise<Organization[]> => {
  try {
    // Get organizations using prisma
    const organizations = await prisma.organization.findMany({
      //filter
      where: {
        name: filters?.name
          ? { contains: filters.name, mode: "insensitive" }
          : undefined, //filter based on name (case insensitive)
        restriction: filters?.restriction, //filter based on restriction
        type: filters?.type, //filter based on type
      },
      //sort
      orderBy: sort ? { [sort.field]: sort.order } : undefined, // sorting by field and order
      //pagination
      skip: pagination?.skip || 0, // skip organizations, 0 by default
      take: pagination?.take || 10, // take organizations, 10 by default
    });
    // Return organizations
    return organizations;
  } catch (error) {
    // Throw error if any
    throw new Error("Failed to get organizations");
  }
};

const getOrganizationById = async (
  id: string
): Promise<Organization | null> => {
  try {
    // Get organization by id using prisma
    const organization = await prisma.organization.findUnique({
      where: { id: id },
    });
    return organization;
  } catch (error) {
    // Throw error if any
    throw new Error("Failed to get organization");
  }
};

const createOrganization = async (
  organizationData: Omit<Organization, "id" | "createdAt" | "updatedAt">
): Promise<Organization> => {
  try {
    // Create organiziation using prisma
    const organization = await prisma.organization.create({
      data: organizationData,
    });
    // Return created organization
    return organization;
  } catch (error) {
    // Throw error if any
    throw new Error("Failed to create the organization");
  }
};

const updateOrganization = async (
  id: string,
  organizationData: Partial<
    Omit<Organization, "id" | "createdAt" | "updatedAt">
  >
): Promise<Organization> => {
  try {
    // Update organization using prisma
    const updatedOrg = await prisma.organization.update({
      where: { id: id },
      data: organizationData,
    });
    // Return updated org
    return updatedOrg;
  } catch (error) {
    // Return error if any
    throw new Error("Organization not found or update failed");
  }
};

const deleteOrganization = async (id: string): Promise<void> => {
  try {
    // Delete organization using prisma
    await prisma.organization.delete({
      where: { id: id },
    });
  } catch (error) {
    // Return error if any
    throw new Error("Organization not found or delete failed");
  }
};

export default {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
};
