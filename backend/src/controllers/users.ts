// controllers/users.ts
import prisma from "../utils/client";
import { User, Role } from "@prisma/client";
import { Users } from "../utils/types";

const getUsers = async (
  filter?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
  },
  sort?: {
    key: string;
    order: "asc" | "desc";
  },
  pagination?: {
    after?: string;
    limit?: string;
  }
): Promise<Users> => {
  // TODO: Implement get users logic
  // This should include handling filters, sorting, and pagination
  throw new Error("getUsers method not implemented");
};

const getUser = async (userId: string): Promise<User | null> => {
  // TODO: Implement get user by ID logic
  throw new Error("getUser method not implemented");
};

const createUser = async (userData: Omit<User, "id">): Promise<User> => {
  // TODO: Implement create user logic
  throw new Error("createUser method not implemented");
};

/**
 * Updates the user with a new User object
 *
 * @param userid - The id of user to be updated
 * @param user - A complete User object
 * @returns A promise with the updated user
 */
const updateUser = async (userid: string, user: User): Promise<User> => {
  try {
    // Update user using prisma
    const updatedUser = await prisma.user.update({
      where: { id: userid },
      data: user,
    });
    // Return updated user
    return updatedUser;
  } catch (error) {
    // Return error if any
    throw new Error("User not found or update failed");
  }
};

/**
 * Deletes specified user by userid.
 *
 * @param userid - The id of the user to be deleted
 * @returns A promise with the deleted user
 */
const deleteUser = async (userid: string): Promise<User> => {

  try {
    // Delete user using prisma
    const deletedUser = await prisma.user.delete({
      where: { id: userid },
    });
    // Return deleted user
    return deletedUser;
  } catch (error) {
    // Throw error message
    throw new Error("User not found or failed to delete user")
  }
};

export default { getUsers, getUser, createUser, updateUser, deleteUser };
