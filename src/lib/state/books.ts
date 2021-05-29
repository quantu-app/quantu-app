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
	geolocation: GeolocationCoordinates | null;
}

export function isJournalBook(value: unknown): value is IJournalBook {
	return value !== null && typeof value === 'object' && value['type'] === BookType.Journal;
}

export async function getGeolocationName(geolocation: GeolocationCoordinates) {
	const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=xml&lat=${geolocation.latitude}&lon=${geolocation.longitude}&zoom=18&addressdetails=1`
		),
		xml = new DOMParser().parseFromString(await response.text(), 'application/xml'),
		addressparts = xml.getElementsByTagName('addressparts')[0],
		country = addressparts?.getElementsByTagName('country')[0]?.textContent,
		state = addressparts?.getElementsByTagName('state')[0]?.textContent,
		town = addressparts?.getElementsByTagName('town')[0]?.textContent;
	return `${town} ${state} ${country}`;
}

export function getGeolocationCoordinates() {
	return new Promise<GeolocationCoordinates | null>((resolve) =>
		navigator.geolocation.getCurrentPosition(
			(position) =>
				resolve({
					accuracy: position.coords.accuracy,
					altitude: position.coords.altitude,
					altitudeAccuracy: position.coords.altitudeAccuracy,
					heading: position.coords.heading,
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					speed: position.coords.speed
				}),
			(error) => {
				console.error(error);
				resolve(null);
			}
		)
	);
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
			book.geolocation = await getGeolocationCoordinates();
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
