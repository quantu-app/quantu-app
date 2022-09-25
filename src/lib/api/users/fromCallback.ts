import type { Email, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { MD5 } from 'md5-js-tools';
import { randomString } from '$lib/utils';
import type { StateUser } from '$lib/state/user';

export interface IFromCallbackParams {
	isCreate?: boolean;
	firstName?: string;
	lastName?: string;
	email: string;
	emailVerified?: boolean;
}

export async function fromCallback(prisma: PrismaClient, params: IFromCallbackParams) {
	const email = await prisma.email.findUnique({
		where: {
			email: params.email
		}
	});
	let user = email
		? await prisma.user.findFirst({
				where: {
					id: email.userId
				},
				select: {
					id: true,
					username: true,
					creator: true,
					active: true,
					emails: true,
					confirmed: true,
					firstName: true,
					lastName: true,
					birthday: true,
					country: true,
					bio: true,
					settings: true,
					createdAt: true,
					updatedAt: true
				}
		  })
		: null;

	if (!user) {
		user = await prisma.user.create({
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
			select: {
				id: true,
				username: true,
				creator: true,
				active: true,
				emails: true,
				confirmed: true,
				firstName: true,
				lastName: true,
				birthday: true,
				country: true,
				bio: true,
				settings: true,
				createdAt: true,
				updatedAt: true
			}
		});
	}

	if (user) {
		const privateUser = user as StateUser;
		const email = getPrimaryEmail(user.emails);
		console.log(JSON.stringify(user, null, 2));
		if (email) {
			privateUser.emailHash = MD5.generate(email);
		}
		return privateUser;
	} else {
		return null;
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

export function getPrimaryEmail(emails: Email[]): string {
	const email = emails.find((email) => email.primary && email.confirmed);
	return email?.email as string;
}
