import Automerge from 'automerge';
import type { Table, Text } from 'automerge';
import { AutomergePersistentStore } from '$lib/state/AutomergePersistentStore';
import { BlocksStore } from './blocks';

export const BOOKS_TABLE = 'books';

export enum BookType {
	Journal = 'journal'
}

export interface IBookBase {
	name: Text;
	type: BookType;
	createdAt: string;
}

export interface IJournalBook extends IBookBase {
	type: BookType.Journal;
}

export function isJournalBlock(value: unknown): value is IJournalBook {
	return value !== null && typeof value === 'object' && value['type'] === BookType.Journal;
}

export type IBook = IJournalBook;

export interface IBooks {
	books: Table<IBook>;
}

class BooksStore extends AutomergePersistentStore<IBooks> {
	private blockStores: Record<string, BlocksStore> = {};

	createBook(type: BookType, name?: string) {
		this.change((doc) => {
			const bookId = doc.books.add({
				name: new Automerge.Text(name || new Date().toDateString()),
				type,
				createdAt: new Date().toJSON()
			});
			const blockStore = new BlocksStore(bookId);
			this.blockStores[bookId] = blockStore;
		});
	}

	getBookById(bookId: string) {
		const blockStore = this.blockStores[bookId];

		if (blockStore) {
			return blockStore;
		} else {
			const blockStore = new BlocksStore(bookId);
			this.blockStores[bookId] = blockStore;
			return blockStore;
		}
	}

	async unloadBookById(bookId: string) {
		const blockStore = this.blockStores[bookId];
		if (blockStore) {
			delete this.blockStores[bookId];
			await blockStore.close();
		}
		return this;
	}
}

export const booksStore = new BooksStore(
	BOOKS_TABLE,
	Automerge.from({
		books: new Automerge.Table()
	})
);
