import { dev } from '$app/env';
import type RemoteStorage from 'remotestoragejs';
import type BaseClient from 'remotestoragejs/release/types/baseclient';

let remoteStorage: RemoteStorage;
let client: BaseClient;

export async function getRemoteStorage() {
	if (!remoteStorage) {
		const { default: RemoteStorage } = await import('remotestoragejs');

		remoteStorage = new RemoteStorage({
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

		remoteStorage.access.claim('*', 'rw');
		remoteStorage.setApiKeys({
			dropbox: 'oqzimgyw2y6tcx2',
			googledrive: '316780669168-7dvm3feqvbser5s85rnpan314u1k75dm.apps.googleusercontent.com'
		} as any);

		await new Promise<void>((resolve) => remoteStorage.on('ready', () => resolve(undefined)));

		client = remoteStorage.scope('/');

		client.declareType('book_metas', {
			type: 'object',
			additionalProperties: true
		});
	}
	return remoteStorage;
}

export async function getClient() {
	await getRemoteStorage();
	return client;
}
