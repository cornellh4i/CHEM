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
  // where holds the filter params
  const where: Prisma.UserWhereInput = {};
  if (filter) {
    if (filter.email) where.email = filter.email;
    if (filter.firstName) where.firstName = filter.firstName;
    if (filter.lastName) where.lastName = filter.lastName;
    if (filter.role) where.role = filter.role;
  }

  // orderBy holds the sort order if one is passed else then default is ascending
  const orderBy: Prisma.UserOrderByWithRelationInput = {
    [sort?.key as keyof User]: sort?.order || Prisma.SortOrder.asc,
  };

  // pagination limits
  const take = pagination?.limit ? parseInt(pagination.limit) : 10;
  const cursor = pagination?.after ? { id: pagination.after } : undefined;

  // db query
  const users = await prisma.user.findMany({
    where,
    orderBy,
    take,
    cursor,
  });

  // total amount of users from this query, useful for pagination
  const total = await prisma.user.count({ where });

  // return object with the result, the next cursor for pagination and the total
  // amount of users
  return {
    result: users,
    nextCursor: users.length == take ? users[users.length - 1].id : undefined,
    total,
  };
};

/**
 * Gets a user by userid
 *
 * @param userid - The id of user to be retrieved
 * @returns Promise with the retrieved user or null
 */
const getUser = async (userid: string) => {
  // uses findunique to find record associated with userid
  try {
    const user = await prisma.user.findUnique({
      where: { id: userid },
    });
    return user;
  } catch (error) {
    throw new Error("User not found");
  }
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

  try {
    const newUser = await prisma.user.create({
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
    return newUser;
  } catch (error) {
    throw new Error("Failed to create new User");
  }
};

/**
 * Updates the user with a new User object
 *
 * @param userid - The id of user to be updated
 * @param user - A complete User object
 * @returns A promise with the updated user
 */
const updateUser = async (userid: string, user: User): Promise<User> => {
  // TODO: Implement updateUser function
  // - Use prisma to update the user with the given id
  // - Return the updated user
};

/**
 * Deletes specified user by userid.
 *
 * @param userid - The id of the user to be deleted
 * @returns A promise with the deleted user
 */
const deleteUser = async (userid: string): Promise<User> => {
  // TODO: Implement deleteUser function
  // - Use prisma to delete the user with the given id
  // - Return the deleted user
};

export default { getUsers, getUser, createUser, updateUser, deleteUser };
