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
	location: Text;
}

export function isJournalBook(value: unknown): value is IJournalBook {
	return value !== null && typeof value === 'object' && value['type'] === BookType.Journal;
}

export async function getGeolocation(position: GeolocationPosition) {
	const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=xml&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`
		),
		xml = new DOMParser().parseFromString(await response.text(), 'application/xml'),
		addressparts = xml.getElementsByTagName('addressparts')[0],
		country = addressparts?.getElementsByTagName('country')[0]?.textContent || '',
		state = addressparts?.getElementsByTagName('state')[0]?.textContent || '',
		town = addressparts?.getElementsByTagName('town')[0]?.textContent || '',
		neighbourhood = addressparts?.getElementsByTagName('neighbourhood')[0]?.textContent || '';
	return { country, state, town, neighbourhood };
}

export function getGeolocationPosition() {
	return new Promise<GeolocationPosition | null>((resolve) =>
		navigator.geolocation.getCurrentPosition(resolve, (error) => {
			console.error(error);
			resolve(null);
		})
	);
}

export async function getLocation() {
	const position = await getGeolocationPosition();

	if (position) {
		const location = await getGeolocation(position),
			city =
				location.town || location.neighbourhood
					? (location.town || location.neighbourhood) + ' '
					: '',
			state = location.state ? location.state + ' ' : '',
			country = location.country ? location.country : '';

		return city + state + country;
	} else {
		return 'Unknown';
	}
}

export type IBook = IJournalBook;

export interface IBooks {
	books: Table<IBook>;
}

class BooksStore extends AutomergePersistentStore<IBooks> {
	private blockStores: Record<string, BlocksStore> = {};

	async createBook(type: BookType, name?: string) {
		const book = {
			name: new Automerge.Text(name || new Date().toDateString()),
			type,
			createdAt: new Date().toJSON()
		} as IBook;

		if (isJournalBook(book)) {
			book.location = new Automerge.Text(await getLocation());
		}

		this.change((doc) => {
			const bookId = doc.books.add(book);
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
