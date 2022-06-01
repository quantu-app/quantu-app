/// <reference types="@sveltejs/kit" />

import type { ITokenValue } from '$lib/api/auth';
import type { IJwtString } from '$lib/api/jwt';
import type { User } from '@prisma/client';
import type * as bootstrap from 'bootstrap';

declare namespace App {
	interface Locals {
		rawToken?: IJwtString<ITokenValue>;
		token?: ITokenValue;
	}
	// interface Platform {}
	interface Session {
		user: Omit<User, 'encryptedPassword'>;
	}
	// interface Stuff {}
}

declare global {
	interface Window {
		bootstrap: typeof bootstrap;
		gtag(type: string, id: string, config?: any): void;
	}
}
