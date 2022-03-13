import type { IOAuth2ProviderConfig, IOAuth2Profile, IOAuth2Tokens } from './OAuth2Provider';
import { OAuth2Provider } from './OAuth2Provider';

export interface GoogleProfile extends IOAuth2Profile {
	sub: string;
	name: string;
	give_name: string;
	picture: string;
	email_verified: boolean;
	locale: string;
}

export interface GoogleTokens extends IOAuth2Tokens {
	access_token: string;
	expires_in: number;
	scope: string;
	token_type: string;
	id_token: string;
}

const DEFAULT_CONFIG: Partial<IOAuth2ProviderConfig> = {
	id: 'google',
	scope: ['openid', 'profile', 'email'],
	accessTokenUrl: 'https://accounts.google.com/o/oauth2/token',
	authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
	profileUrl: 'https://openidconnect.googleapis.com/v1/userinfo'
};

export class GoogleOAuth2Provider extends OAuth2Provider<GoogleProfile, GoogleTokens> {
	constructor(config: Partial<IOAuth2ProviderConfig> = {}) {
		super({
			...DEFAULT_CONFIG,
			...config
		} as IOAuth2ProviderConfig);
	}
}
