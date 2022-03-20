import type { PrismaClient } from "@prisma/client";

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
		// todo: check if user exist (we must ensure username is unique)
		// - if exists: add hash to email for unique username
		// - else: just create the user.
		return prisma.user.create({
			data: {
				username: params.email.split('@')[0],
				encryptedPassword: Math.random().toString(36).slice(2),
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