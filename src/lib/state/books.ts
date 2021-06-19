import Automerge, { FreezeObject } from 'automerge';
import type { Table, Text, ChangeFn, UUID } from 'automerge';
import { getLocationName, applyOpsToText } from '$lib/utils';
import { BlockType, isTextBlock, ITextBlock } from './blocks';
import type { IBlock, IBlockBase } from './blocks';
import { PersistentStore } from './PersistentStore';
import { AutomergePersistentStore } from './AutomergePersistentStore';

export enum BookType {
	Journal = 'journal',
	Notes = 'notes'
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
	tags: string[];
	language: string;
	wordCount: number;
	createdAt: string;
	updatedAt: string;
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

function createEmptyBlock(type: BlockType) {
	const block: IBlockBase = {
		type,
		index: 0,
		createdAt: new Date().toJSON()
	};

	if (isTextBlock(block)) {
		block.text = [];
	}

	return block;
}

export class BookStore<T extends IBookBase = IBookBase> extends AutomergePersistentStore<T> {
	private bookId: string;

	constructor(bookId: string, initialState: FreezeObject<T>) {
		super(`books/${bookId}`, initialState);
		this.bookId = bookId;
	}

	static async deleteBook(bookId: string) {
		await AutomergePersistentStore.remove(`books/${bookId}`);
	}

	asJournalBook(): BookStore<IJournalBook> {
		return this as unknown as BookStore<IJournalBook>;
	}
	asNotesBook(): BookStore<INotesBook> {
		return this as unknown as BookStore<INotesBook>;
	}

	getBookId() {
		return this.bookId;
	}

	createBlock(type: BlockType) {
		const block = createEmptyBlock(type);

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

function createEmptyBook(id: UUID, type: BookType, name?: string) {
	return {
		id,
		name: new Automerge.Text(name),
		type,
		createdAt: new Date().toJSON(),
		blocks: new Automerge.Table()
	} as IBookBase as IBook;
}

async function createBook(id: UUID, type: BookType, name?: string) {
	const book = createEmptyBook(id, type, name || new Date().toDateString());

	if (isJournalBook(book)) {
		book.location = new Automerge.Text(await getLocationName());
	}

	return book;
}

function getWordCount(book: IBook) {
	return book.blocks.rows.reduce((count, block) => {
		if (isTextBlock(block)) {
			return (
				count +
				applyOpsToText(new Automerge.Text(), block.text)
					.toString()
					.replace(/[\s]+/g, ' ')
					.trim()
					.split(' ').length
			);
		} else {
			return count;
		}
	}, 0);
}

class BooksStore extends PersistentStore<IBooks> {
	private bookStores: Record<UUID, BookStore> = {};

	private onPersist = (book: IBook) => {
		this.update((state) => ({
			...state,
			[book.id]: {
				...state[book.id],
				name: book.name.toString(),
				wordCount: getWordCount(book),
				updatedAt: new Date().toJSON()
			}
		}));
	};

	private createBookStore(bookId: string, book: IBook) {
		const bookStore = new BookStore(bookId, Automerge.from(book));
		bookStore.on('persist', (doc) => {
			const bookMeta = this.get()[doc.id];

			if (bookMeta) {
				this.onPersist(doc, bookMeta);
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
			book = await createBook(bookId, type, name);

		this.update((state) => ({
			...state,
			[bookId]: {
				name: book.name.toString(),
				type,
				tags: [],
				wordCount: 0,
				language: 'en',
				createdAt: book.createdAt,
				updatedAt: book.createdAt
			}
		}));

		const bookStore = this.createBookStore(bookId, book);
		bookStore.change((doc) => {
			if (isJournalBook(doc)) {
				doc.blocks.add(createEmptyBlock(BlockType.Text) as ITextBlock);
			}
		});
		bookStore;
		this.bookStores[bookId] = bookStore;
		return bookStore;
	}

	deleteBookById(bookId: UUID) {
		BookStore.deleteBook(bookId);
		this.update((state) => {
			const newState = { ...state };
			delete newState[bookId];
			return newState;
		});
	}

	getBookById(bookId: UUID) {
		const bookStore = this.bookStores[bookId];

		if (bookStore) {
			return bookStore;
		} else {
			const bookStore = this.createBookStore(
				bookId,
				createEmptyBook(bookId, DEFAULT_BOOK_TYPE, undefined)
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

export const booksStore = new BooksStore('book_metas', {});
