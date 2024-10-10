// controllers/organizations.ts
import prisma from "../utils/client";
import { Organization } from "@prisma/client";

const getOrganizations = async (
  filters?: { name?: string; restriction?: string; type?: string }, //filter based on name, restriction, and type
  sort?: {
    field: "name" | "createdAt" | "units" | "amount";
    order: "asc" | "desc";
  }, //sort by name, date, units, or amount in ascending or descending order
  pagination?: { skip?: number; take?: number } //pagination parameters
): Promise<Organization[]> => {
  try {
    // Get organizations using prisma
    const organizations = await prisma.organization.findMany({
      where: {
        name: filters?.name
          ? { contains: filters.name, mode: "insensitive" }
          : undefined, //filter based on name (case insensitive)
        restriction: filters?.restriction, //filter based on restriction
        type: filters?.type, //filter based on type
      },
      orderBy: sort ? { [sort.field]: sort.order } : undefined, // sorting by field and order
      skip: pagination?.skip || 0,
      take: pagination?.take || 10,
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
  // TODO: Implement get organization by ID logic
  throw new Error("getOrganizationById method not implemented");
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
  // TODO: Implement delete organization logic
  throw new Error("deleteOrganization method not implemented");
};

export default {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
};
