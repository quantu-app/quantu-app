import Automerge from 'automerge';
import type { Table, Text, ChangeFn, UUID } from 'automerge';
import { AutomergePersistentStore } from '$lib/state/AutomergePersistentStore';
import { getLocationName } from '$lib/utils';
import { BlockType, isTextBlock } from './blocks';
import type { IBlock, IBlockBase } from './blocks';
import { PersistentStore } from './PersistentStore';

export const BOOKS_TABLE = 'books';

export enum BookType {
	Notes = 'notes',
	Journal = 'journal'
}

export const DEFAULT_BOOK_TYPE = BookType.Notes;

export interface IBookBase {
	id: UUID;
	name: Text;
	type: BookType;
	createdAt: string;
	blocks: Table<IBlock>;
}

export interface IBookMeta {
	name: string;
	type: BookType;
	createdAt: string;
}

export interface IJournalBook extends IBookBase {
	type: BookType.Journal;
	location: Text;
}

export function isJournalBook(value: unknown): value is IJournalBook {
	return value !== null && typeof value === 'object' && value['type'] === BookType.Journal;
}

export interface INotesBook extends IBookBase {
	type: BookType.Notes;
}

export function isNotesBook(value: unknown): value is INotesBook {
	return value !== null && typeof value === 'object' && value['type'] === BookType.Notes;
}

export type IBook = IJournalBook | INotesBook;

export class BookStore extends AutomergePersistentStore<IBook> {
	createBlock(type: BlockType) {
		const block: IBlockBase = {
			type,
			index: 0,
			createdAt: new Date().toJSON()
		};

		if (isTextBlock(block)) {
			block.text = new Automerge.Text();
		}

		this.change((doc) => {
			block.index = doc.blocks.rows.reduce(
				(maxIndex, b) => (maxIndex <= b.index ? b.index + 1 : maxIndex),
				0
			);
			doc.blocks.add(block as IBlock);
		});

		return block;
	}

	updateBlock(blockId: string, changeFn: ChangeFn<IBlock>) {
		this.change((doc) => {
			const block = doc.blocks.byId(blockId);

			if (block) {
				changeFn(block);
			}
		});
	}
}

export type IBooks = Record<UUID, IBookMeta>;

function createEmptyBook(type: BookType, name?: string) {
	return {
		name: new Automerge.Text(name),
		type,
		createdAt: new Date().toJSON(),
		blocks: new Automerge.Table()
	} as IBookBase as IBook;
}

async function createBook(type: BookType, name?: string) {
	const book = createEmptyBook(type, name || new Date().toDateString());

	if (isJournalBook(book)) {
		book.location = new Automerge.Text(await getLocationName());
	}

	return book;
}

class BooksStore extends PersistentStore<IBooks> {
	private bookStores: Record<UUID, BookStore> = {};

	private createBookStore(bookId: string, book: IBook) {
		const bookStore = new BookStore(`${BOOKS_TABLE}/${bookId}`, Automerge.from(book));
		bookStore.on('persist', (doc) => {
			const book = this.get().books[doc.id],
				name = doc.name.toString();

			if (book && book.name !== name) {
				this.update((state) => ({ ...state, [doc.id]: { ...state[doc.id], name } }));
			}
		});
		return bookStore;
	}

	private createBookUUID() {
		const bookId = Automerge.uuid();

		if (bookId in this.get()) {
			return this.createBookUUID();
		} else {
			return bookId;
		}
	}

	async createBook(type: BookType, name?: string) {
		const bookId = this.createBookUUID(),
			book = await createBook(type, name);

		this.update((state) => {
			const bookMeta = {
				name: book.name.toString(),
				type,
				createdAt: book.createdAt
			};
			state[bookId] = bookMeta;
			return state;
		});

		const bookStore = this.createBookStore(bookId, book);
		this.bookStores[bookId] = bookStore;
		return bookStore;
	}

	getBookById(bookId: string) {
		const bookStore = this.bookStores[bookId];

		if (bookStore) {
			return bookStore;
		} else {
			const bookStore = new BookStore(
				bookId,
				Automerge.from(createEmptyBook(DEFAULT_BOOK_TYPE, undefined))
			);
			this.bookStores[bookId] = bookStore;
			return bookStore;
		}
	}

	async unloadBookById(bookId: string) {
		const bookStore = this.bookStores[bookId];
		if (bookStore) {
			delete this.bookStores[bookId];
			await bookStore.close();
		}
		return this;
	}
}

export const booksStore = new BooksStore(BOOKS_TABLE, {});
