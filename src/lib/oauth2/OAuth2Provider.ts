export interface IOAuth2Tokens {
	access_token: string;
	token_type: string;
}

export interface IOAuth2Profile {
	email: string;
}

export interface IOAuth2ProviderConfig {
	id: string;
	redirectPath: string;
	accessTokenUrl?: string;
	authorizationUrl?: string;
	profileUrl?: string;
	clientId?: string;
	clientSecret?: string;
	scope?: string | string[];
	headers?: Record<string, string | number | boolean>;
	authorizationParams?: Record<string, string | number | boolean>;
	params?: Record<string, string | number | boolean>;
	grantType?: string;
	responseType?: string;
	contentType?: 'application/json' | 'application/x-www-form-urlencoded';
}

const DEFAULT_CONFIG: Partial<IOAuth2ProviderConfig> = {
	responseType: 'code',
	grantType: 'authorization_code',
	contentType: 'application/json'
};

export class OAuth2Provider<
	Profile extends IOAuth2Profile = IOAuth2Profile,
	Tokens extends IOAuth2Tokens = IOAuth2Tokens,
	Config extends IOAuth2ProviderConfig = IOAuth2ProviderConfig
> {
	protected config: Config;

	constructor(config: Config) {
		this.config = {
			...DEFAULT_CONFIG,
			...config,
			redirectPath: `/api/oauth2/${config.id}/callback`
		};
	}

	signin(url: URL, state: object = {}) {
		const base64State = Buffer.from(
			Object.entries(state)
				.map(([k, v]) => `${k}=${v}`)
				.join(',')
		).toString('base64');
		const nonce = Math.round(Math.random() * 1000).toString();
		return this.getAuthorizationUrl(url, base64State, nonce);
	}

	async callback(url: URL): Promise<{ profile: Profile; tokens: Tokens; state: object }> {
		const code = url.searchParams.get('code') as string;
		const state = getState(url.searchParams);

		const tokens = await this.getTokens(code, url.origin + this.config.redirectPath);
		const profile = await this.getUserProfile(tokens);

		return { profile, tokens, state };
	}

	getAuthorizationUrl(url: URL, state: string, nonce: string) {
		return `${this.config.authorizationUrl}?${new URLSearchParams({
			state,
			nonce,
			response_type: this.config.responseType as string,
			client_id: this.config.clientId as string,
			scope: Array.isArray(this.config.scope)
				? this.config.scope.join(' ')
				: (this.config.scope as string),
			redirect_uri: url.origin + this.config.redirectPath,
			...(this.config.authorizationParams ?? {})
		})}`;
	}

	getTokens(code: string, redirectUri: string): Promise<Tokens> {
		const data = {
			code,
			grant_type: this.config.grantType,
			client_id: this.config.clientId,
			redirect_uri: redirectUri,
			client_secret: this.config.clientSecret,
			...(this.config.params ?? {})
		};

		let body: string;
		if (this.config.contentType === 'application/x-www-form-urlencoded') {
			body = Object.entries(data)
				.map(
					([key, value]) =>
						`${encodeURIComponent(key)}${value ? `=${encodeURIComponent(value)}` : ''}`
				)
				.join('&');
		} else {
			body = JSON.stringify(data);
		}

		return fetch(this.config.accessTokenUrl as string, {
			body,
			method: 'POST',
			headers: {
				'Content-Type': this.config.contentType || 'application/json',
				...(this.config.headers ?? {})
			}
		}).then((res) => res.json());
	}

	getUserProfile(tokens: Tokens): Promise<Profile> {
		return fetch(this.config.profileUrl as string, {
			headers: { Authorization: `${tokens.token_type} ${tokens.access_token}` }
		})
			.then((res) => res.json())
			.then((profile) => (profile['error'] ? Promise.reject(profile) : profile));
	}
}

function getState(query: URLSearchParams): Record<string, string> {
	const state = query.get('state');
	if (state) {
		const state = Buffer.from(query.get('state') as string, 'base64').toString();
		return state
			.split(',')
			.map((kv) => kv.split('='))
			.reduce((state, [key, value]) => ({ ...state, [key]: value }), {});
	} else {
		return {};
	}
}
