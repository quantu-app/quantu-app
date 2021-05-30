import Automerge from 'automerge';
import type { Table } from 'automerge';
import { AutomergePersistentStore } from './AutomergePersistentStore';

export const DROPBOX_TABLE = 'dropbox';

export async function sync() {
	Dropbox.save(options);
}

export interface IDropboxFile {
	dropboxId: string;
	table: string;
}

export interface IDropboxFiles {
	files: Table<IDropboxFile>;
}

class DropboxStore extends AutomergePersistentStore<IDropboxFiles> {}

export const dropboxStore = new DropboxStore(
	DROPBOX_TABLE,
	Automerge.from({
		files: new Automerge.Table()
	})
);
