import type { IOAuth2ProviderConfig, IOAuth2Profile, IOAuth2Tokens } from './OAuth2Provider';
import { OAuth2Provider } from './OAuth2Provider';

export interface FacebookProfile extends IOAuth2Profile {
	id: string;
	name: string;
	first_name: string;
	last_name: string;
	name_format: string;
	picture: { data: { height: number; is_silhouette: boolean; url: string; width: number } };
	short_name: string;
}

export interface FacebookTokens extends IOAuth2Tokens {
	access_token: string;
	token_type: string;
	expires_in: number;
}

export interface FacebookOAuth2ProviderConfig extends IOAuth2ProviderConfig {
	userProfileFields?: string | (keyof FacebookProfile)[] | (string | number | symbol)[];
}

const DEFAULT_CONFIG: Partial<FacebookOAuth2ProviderConfig> = {
	id: 'facebook',
	scope: ['email', 'public_profile', 'user_link'],
	userProfileFields: [
		'id',
		'name',
		'first_name',
		'last_name',
		'middle_name',
		'name_format',
		'picture',
		'short_name',
		'email'
	],
	profileUrl: 'https://graph.facebook.com/v13.0/me',
	authorizationUrl: 'https://www.facebook.com/v13.0/dialog/oauth',
	accessTokenUrl: 'https://graph.facebook.com/v13.0/oauth/access_token'
};

export class FacebookOAuth2Provider extends OAuth2Provider<
	FacebookProfile,
	FacebookTokens,
	FacebookOAuth2ProviderConfig
> {
	constructor(config: Partial<FacebookOAuth2ProviderConfig> = {}) {
		const userProfileFields = config.userProfileFields ?? DEFAULT_CONFIG.userProfileFields;
		const data = {
			fields: Array.isArray(userProfileFields) ? userProfileFields.join(',') : userProfileFields
		};
		const profileUrl = `${config.profileUrl ?? DEFAULT_CONFIG.profileUrl}?${new URLSearchParams(
			data
		)}`;

		super({
			...DEFAULT_CONFIG,
			...config,
			profileUrl
		} as FacebookOAuth2ProviderConfig);
	}

	getUserProfile(tokens: FacebookTokens): Promise<FacebookProfile> {
		const url = new URL(this.config.profileUrl);
		url.searchParams.set('access_token', tokens.access_token);
		return fetch(url.toString())
			.then((res) => res.json())
			.then((profile) => (profile['error'] ? Promise.reject(profile) : profile));
	}
}
