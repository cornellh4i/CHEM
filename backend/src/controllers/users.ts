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
    company?: string;
    phone?: string;
    website?: string;
    location?: string;
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
  /** Prisma filtering object, handles GET /users?firstName=Bob&lastName=Jackson */
  const whereDict = {
    email: filter?.email,
    firstName: filter?.firstName,
    lastName: filter?.lastName,
    company: filter?.company,
    phone: filter?.phone,
    role: { equals: filter?.role },
  };

  /** Prisma sort object, handles GET /users?sort=firstName:asc */
  const orderBy: { [key: string]: Prisma.SortOrder } = sort
    ? { [sort.key]: sort.order }
    : { id: "asc" };

  /** Prisma pagination object, handles GET /users?limit=20&after=asdf */
  let take = pagination?.limit ? parseInt(pagination?.limit as string) : 10;
  let skip = pagination?.after ? 1 : undefined;
  let cursor = pagination?.after
    ? { id: pagination?.after as string }
    : undefined;

  /** Total number of records before pagination is applied */
  const total = await prisma.user.count({
    where: { AND: [whereDict] },
  });

  const result = await prisma.user.findMany({
    where: { AND: [whereDict] },
    orderBy: orderBy,
    take: take,
    skip: skip,
    cursor: cursor,
  });

  const lastVisiblePost = take ? result[take - 1] : result[result.length - 1];
  const nextCursor = lastVisiblePost ? lastVisiblePost.id : "";

  return { result, nextCursor, total };
};

/**
 * Gets a user by userid
 *
 * @param userid - The id of user to be retrieved
 * @returns Promise with the retrieved user or null
 */
const getUser = async (userid: string) => {
  return prisma.user.findUnique({
    where: { id: userid },
  });
};

/**
 * Creates a new user
 *
 * @param user - User object
 * @returns Promise with the created user
 */
const createUser = async (user: User): Promise<User> => {
  return prisma.user.create({
    data: { ...user },
  });
};

/**
 * Updates the user with a new User object
 *
 * @param userid - The id of user to be updated
 * @param user - A complete User object
 * @returns A promise with the updated user
 */
const updateUser = async (userid: string, user: User): Promise<User> => {
  return prisma.user.update({
    where: { id: userid },
    data: { ...user },
  });
};

/**
 * Deletes specified user by userid.
 *
 * @param userid - The id of the user to be deleted
 * @returns A promise with the deleted user
 */
const deleteUser = async (userid: string): Promise<User> => {
  return prisma.user.delete({
    where: {
      id: userid,
    },
  });
};

export default { getUsers, getUser, createUser, updateUser, deleteUser };
