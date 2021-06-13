import { dev } from '$app/env';
import RemoteStorage from 'remotestoragejs';

export const remoteStorage = new RemoteStorage({
	cache: true,
	changeEvents: {
		local: true,
		window: false,
		remote: true,
		conflict: true
	},
	logging: dev,
	modules: []
});

remoteStorage.setApiKeys({
	dropbox: 'oqzimgyw2y6tcx2',
	googledrive: '316780669168-7dvm3feqvbser5s85rnpan314u1k75dm.apps.googleusercontent.com'
});

remoteStorage.scope('/').declareType('book_metas', {
	type: 'object',
	additionalProperties: true
});
