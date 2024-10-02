import prisma from "../utils/client";
import { Prisma, Role, User } from "@prisma/client";
import { Users } from "../utils/types";

/**
 * Gets all users in database and all data associated with each user
 *
 * @param filter - Filter params passed in
 * @param sort - Sort params passed in
 * @param pagination - Pagination params passed in
 * @returns A promise with list of users
 */
const getUsers = async (
  filter?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
  },
  sort?: {
    key: string;
    order: Prisma.SortOrder;
  },
  pagination?: {
    after?: string;
    limit?: string;
  }
): Promise<Users> => {
  // TODO: Implement getUsers function
  // - Apply filters
  // - Apply sorting
  // - Apply pagination
  // - Return Users object with result, nextCursor, and total
};

/**
 * Gets a user by userid
 *
 * @param userid - The id of user to be retrieved
 * @returns Promise with the retrieved user or null
 */
const getUser = async (userid: string) => {
  // TODO: Implement getUser function
  // - Use prisma to find a unique user by id
  // - Return the user or null if not found
};

/**
 * Creates a new user
 *
 * @param user - User object
 * @returns Promise with the created user
 */
const createUser = async (user: User): Promise<User> => {
  // TODO: Implement createUser function
  // - Use prisma to create a new user
  // - Return the created user
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
    // update user using prisma
    const updatedUser = await prisma.user.update({
      where: { id: userid },
      data: user,
    });
    // return updated user
    return updatedUser;
  } catch (error) {
    // return error if any
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
    // delete user using prisma
    const deletedUser = await prisma.user.delete({
      where: { id: userid },
    });
    // return deleted user
    return deletedUser;
  } catch (error) {
    // throw error message
    throw new Error("User not found or failed to delete user")
  }
};

export default { getUsers, getUser, createUser, updateUser, deleteUser };
