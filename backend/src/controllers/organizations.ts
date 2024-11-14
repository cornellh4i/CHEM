import prisma from "../utils/client";
import { Organization, Prisma } from "@prisma/client";

// Get organizations with filtering, sorting, and paginations
const getOrganizations = async (
  // filter based on name, restriction, and type
  filters?: { name?: string; restriction?: string; type?: string },
  // sort based on either name, date, units, or amount in ascending or descending order
  sort?: {
    field: "name" | "createdAt" | "units" | "amount";
    order: "asc" | "desc";
  },
  // pagination parameters
  pagination?: { skip?: number; take?: number }
): Promise<{ organizations: Organization[]; total: number }> => {
  try {
    // Construct the where clause for filtering
    const where: Prisma.OrganizationWhereInput = {
      name: filters?.name
        ? { contains: filters.name, mode: "insensitive" }
        : undefined, // filter based on name (case insensitive)
      restriction: filters?.restriction, // filter based on restriction
      type: filters?.type, // filter based on type
    };

    // Use Prisma's transaction to get organizations and total count
    const [organizations, total] = await prisma.$transaction([
      prisma.organization.findMany({
        where,
        orderBy: sort ? { [sort.field]: sort.order } : undefined, // sorting by field and order
        skip: pagination?.skip || 0, // skip organizations, 0 by default
        take: pagination?.take || 100, // take organizations, 10 by default
      }),
      prisma.organization.count({ where }),
    ]);

    // Return organizations and total count
    return { organizations, total };
  } catch (error) {
    // Throw a more informative error
    if (error instanceof Error) {
      throw new Error(`Failed to get organizations: ${error.message}`);
    }
    throw new Error("Failed to get organizations due to an unknown error");
  }
};

// Get a single organization by ID
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
    // Throw a more informative error
    if (error instanceof Error) {
      throw new Error(`Failed to get organization: ${error.message}`);
    }
    throw new Error("Failed to get organization due to an unknown error");
  }
};

// Create a new organization
const createOrganization = async (
  organizationData: Omit<Organization, "id" | "createdAt" | "updatedAt">
): Promise<Organization> => {
  try {
    // Validate the input data
    const validData: Prisma.OrganizationCreateInput = {
      name: organizationData.name,
      description: organizationData.description,
      type: organizationData.type || "Endowment", // Use default if not provided
      restriction: organizationData.restriction || "Restricted", // Use default if not provided
      units: organizationData.units || 0,
      amount: organizationData.amount || 0,
    };

    // Create organization using prisma
    const organization = await prisma.organization.create({
      data: validData,
    });

    // Return created organization
    return organization;
  } catch (error) {
    // Throw a more informative error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("An organization with this name already exists");
      }
    }
    if (error instanceof Error) {
      throw new Error(`Failed to create the organization: ${error.message}`);
    }
    throw new Error(
      "Failed to create the organization due to an unknown error"
    );
  }
};

// Update an existing organization
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
    // Throw a more informative error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Organization not found");
      }
    }
    if (error instanceof Error) {
      throw new Error(`Failed to update organization: ${error.message}`);
    }
    throw new Error("Failed to update organization due to an unknown error");
  }
};

// Delete an organization
const deleteOrganization = async (id: string): Promise<Organization> => {
  try {
    // Delete organization using prisma
    const deletedOrg = await prisma.organization.delete({
      where: { id: id },
    });
    // Return deleted organization
    return deletedOrg;
  } catch (error) {
    // Throw a more informative error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Organization not found");
      }
    }
    if (error instanceof Error) {
      throw new Error(`Failed to delete organization: ${error.message}`);
    }
    throw new Error("Failed to delete organization due to an unknown error");
  }
};

export default {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
};
