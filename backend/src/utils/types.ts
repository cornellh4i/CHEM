import { User } from "@prisma/client";

export interface ErrorMessage {
  error: string;
}

export interface Users {
  result: User[];
  nextCursor: string | undefined;
  total: number;
}
