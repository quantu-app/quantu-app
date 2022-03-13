import { FacebookOAuth2Provider } from './FacebookOAuth2Provider';
import { GoogleOAuth2Provider } from './GoogleOAuth2Provider';
import type { OAuth2Provider } from './OAuth2Provider';

export const google = new GoogleOAuth2Provider({
	clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
	clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET
});

export const facebook = new FacebookOAuth2Provider({
	clientId: process.env.FACEBOOK_OAUTH_CLIENT_ID,
	clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET
});

export const providers: { [provider: string]: OAuth2Provider } = { google, facebook };
