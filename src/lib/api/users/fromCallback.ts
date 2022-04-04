import type { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { randomString } from '$lib/utils';

export interface IFromCallbackParams {
	isCreate?: boolean;
	firstName?: string;
	lastName?: string;
	email: string;
	emailVerified?: boolean;
}

export async function fromCallback(prisma: PrismaClient, params: IFromCallbackParams) {
	const email = await prisma.email.findFirst({
		where: {
			email: params.email
		}
	});
	const user = email
		? await prisma.user.findFirst({
				where: {
					id: email.userId
				},
				include: {
					emails: true
				}
		  })
		: null;

	if (user) {
		return user;
	} else {
		return prisma.user.create({
			data: {
				username: await getUniqueUsername(prisma, params.email.split('@')[0]),
				encryptedPassword: await hash(randomString(16), 13),
				firstName: params.firstName,
				lastName: params.lastName,
				bio: [],
				emails: {
					create: {
						email: params.email,
						confirmed: !!params.emailVerified,
						primary: true
					}
				}
			},
			include: {
				emails: true
			}
		});
	}
}

async function getUniqueUsername(prisma: PrismaClient, username: string): Promise<string> {
	const user = await prisma.user.findUnique({
		where: {
			username: username
		}
	});
	if (user) {
		return getUniqueUsername(prisma, `${username}${randomString(2)}`);
	} else {
		return username;
	}
}
