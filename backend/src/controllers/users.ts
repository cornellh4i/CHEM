import prisma from "../utils/client";
import { User, Role, Prisma } from "@prisma/client";
import { Users } from "../utils/types";

const getUsers = async (
  filter?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
  },
  sort?: {
    key: keyof User;
    order: "asc" | "desc";
  },
  pagination?: {
    after?: string;
    limit?: number;
  }
): Promise<Users> => {
  const where: Prisma.UserWhereInput = {
    ...(filter?.email && {
      email: { contains: filter.email, mode: "insensitive" },
    }),
    ...(filter?.firstName && {
      firstName: { contains: filter.firstName, mode: "insensitive" },
    }),
    ...(filter?.lastName && {
      lastName: { contains: filter.lastName, mode: "insensitive" },
    }),
    ...(filter?.role && { role: filter.role }),
  };

  const orderBy: Prisma.UserOrderByWithRelationInput | undefined = sort
    ? { [sort.key]: sort.order }
    : undefined;

  const take = pagination?.limit || 100;
  const cursor = pagination?.after ? { id: pagination.after } : undefined;

  try {
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        orderBy,
        take,
        ...(cursor && { cursor, skip: 1 }),
      }),
      prisma.user.count({ where }),
    ]);

    return {
      result: users,
      nextCursor:
        users.length === take ? users[users.length - 1].id : undefined,
      total,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching users");
  }
};

const getUser = async (userId: string): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new Error("User not found");
    return user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching the user");
  }
};

const createUser = async (
  userData: Omit<User, "id" | "createdAt" | "updatedAt">
): Promise<User> => {
  try {
    const newUser = await prisma.user.create({
      data: userData,
    });
    return newUser;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("A user with this email already exists");
      }
    }
    if (error instanceof Error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
    throw new Error("An unknown error occurred while creating the user");
  }
};

const updateUser = async (
  userId: string,
  userData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
): Promise<User> => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });
    return updatedUser;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("User not found");
      }
    }
    if (error instanceof Error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
    throw new Error("An unknown error occurred while updating the user");
  }
};

const deleteUser = async (userId: string): Promise<User> => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    return deletedUser;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("User not found");
      }
    }
    if (error instanceof Error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
    throw new Error("An unknown error occurred while deleting the user");
  }
};

export default { getUsers, getUser, createUser, updateUser, deleteUser };
