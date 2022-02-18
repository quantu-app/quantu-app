import type { PrismaClient, User } from "@prisma/client";

export interface IUpdateUserParams extends Partial<User> {
  userId: string;
}

export async function updateUser(prisma: PrismaClient, params: IUpdateUserParams) {
  return prisma.user.update({
    data: {
      ...params
    },
    where: {
      id: params.userId
    },
    include: {
      emails: true
    }
  });
}