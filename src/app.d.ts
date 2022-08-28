/// <reference types="@sveltejs/kit" />

import type { ITokenValue } from '$lib/api/auth';
import type { IJwtString } from '$lib/api/jwt';
import type { User } from '@prisma/client';
import type * as bootstrap from 'bootstrap';

declare global {
	declare namespace App {
		interface Locals {
			rawToken?: IJwtString<ITokenValue>;
			token?: ITokenValue;
		}

		// interface Platform {}

		// interface PrivateEnv {}

		// interface PublicEnv {}

		interface Session {
			user?: Omit<User, 'encryptedPassword'>;
		}

		// interface Stuff {}
	}

	interface Window {
		bootstrap: typeof bootstrap;
		dataLayer: IArguments[];
		gtag(type: string, ...args: any[]): void;
	}

	namespace NodeJS {
		interface ProcessEnv {
			S3_ACCESS_KEY: string;
			S3_SECRET_KEY: string;
			S3_REGION: string;

			JWT_SECRET_KEY: string;

			GOOGLE_OAUTH_CLIENT_ID: string;
			GOOGLE_OAUTH_CLIENT_SECRET: string;

			FACEBOOK_OAUTH_CLIENT_ID: string;
			FACEBOOK_OAUTH_CLIENT_SECRET: string;
		}
	}
}
