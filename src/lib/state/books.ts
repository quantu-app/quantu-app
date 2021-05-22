import Automerge from 'automerge';
import type { Table, ChangeFn, UUID, Text } from 'automerge';
import { AutomergePersistentStore } from './AutomergePersistentStore';

export enum BlockType {
	Text = 'text'
}

export interface IBaseBlock {
	type: BlockType;
	index: number;
	geolocation: GeolocationCoordinates | null;
	createdAt: string;
}

export interface ITextBlock extends IBaseBlock {
	type: BlockType.Text;
	text: Text;
}

export async function getGeolocationCoordinates() {
	const geolocationPosition = await new Promise<GeolocationPosition | null>((resolve) =>
		navigator.geolocation.getCurrentPosition(resolve, (error) => {
			console.error(error);
			resolve(null);
		})
	);
	return geolocationPosition ? geolocationPosition.coords : null;
}

export function isTextBlock(value: unknown): value is ITextBlock {
	return value !== null && typeof value === 'object' && value['type'] === BlockType.Text;
}

export type IBlock = ITextBlock;

export async function createBlock(bookId: string, type: BlockType) {
	const block: IBaseBlock = {
		type,
		index: 0,
		geolocation: await getGeolocationCoordinates(),
		createdAt: new Date().toJSON()
	};

	if (isTextBlock(block)) {
		block.text = new Automerge.Text();
	}

	booksStore.getBookById(bookId).change((book) => {
		block.index = book.blocks.rows.reduce(
			(maxIndex, block) => (maxIndex >= block.index ? maxIndex : block.index + 1),
			0
		);
		book.blocks.add(block as IBlock);
	});
}

export function updateBlock(bookId: string, blockId: string, changeFn: ChangeFn<IBlock>) {
	booksStore.getBookById(bookId).change((book) => {
		const block = book.blocks.byId(blockId);

		if (block) {
			changeFn(block);
		}
	});
}

export interface IBookStore {
	bookMetaId: UUID;
	blocks: Table<IBlock>;
}

export enum BookType {
	Journel = 'journel'
}

export interface IBookMeta {
	name: Text;
	type: BookType;
	createdAt: string;
}

export interface IBooksStore {
	metas: Table<IBookMeta>;
}

export function bookStoreId(bookId: UUID) {
	return `book-${bookId}`;
}

class BooksStore extends AutomergePersistentStore<IBooksStore> {
	private bookStores: Record<string, AutomergePersistentStore<IBookStore>> = {};

	createBook(name: string, type: BookType) {
		let bookMetaId: UUID;
		this.change((doc) => {
			const date = new Date().toJSON();
			bookMetaId = doc.metas.add({
				name: new Automerge.Text(name),
				type,
				createdAt: date
			});
		});
		const bookStore = new AutomergePersistentStore<IBookStore>(
			bookStoreId(bookMetaId),
			Automerge.from({
				bookMetaId,
				blocks: new Automerge.Table()
			})
		);
		this.bookStores[bookMetaId] = bookStore;
		return bookStore;
	}

	getBookById(bookMetaId: string) {
		const bookStore = this.bookStores[bookMetaId];

		if (bookStore) {
			return bookStore;
		} else {
			const bookStore = new AutomergePersistentStore<IBookStore>(
				bookStoreId(bookMetaId),
				Automerge.from({
					bookMetaId,
					name: new Automerge.Text(),
					createdAt: new Date().toJSON(),
					blocks: new Automerge.Table()
				})
			);
			this.bookStores[bookMetaId] = bookStore;
			return bookStore;
		}
	}

	unloadBookById(bookMetaId: string) {
		delete this.bookStores[bookMetaId];
		return this;
	}
}

export const booksStore = new BooksStore(
	'books',
	Automerge.from({
		metas: new Automerge.Table()
	})
);
