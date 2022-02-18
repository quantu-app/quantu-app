import type { PrismaClient } from "@prisma/client";

export interface IShowPrivateUserParams {
  userId: string;
}

export async function showPrivateUser(prisma: PrismaClient, params: IShowPrivateUserParams) {
  return prisma.user.findUnique({
    where: {
      id: params.userId
    },
    include: {
      emails: true
    }
  });
}