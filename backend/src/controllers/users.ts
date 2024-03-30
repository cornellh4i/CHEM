import { Prisma, Role } from "@prisma/client";
import { Users } from "../utils/types";
import prisma from "../utils/client";

/**
 * Gets all users in database and all data associated with each user
 * @param filter are the filter params passed in
 * @param sort are sort params passed in
 * @param pagination are the pagination params passed in
 * @returns promise with list of users
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
  const nextCursor = lastVisiblePost ? lastVisiblePost.id : undefined;

  return { result, nextCursor, total };
};

export default { getUsers };
