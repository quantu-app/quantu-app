import { Table } from 'automerge';
import { persistentStore } from './persistentStore';

export interface IBook {
	name: string;
}

export const booksStore = persistentStore('books', {
	table: new Table<IBook>()
});

export function createBook(name: string) {
	let id: string;
	booksStore.change(({ table }) => {
		id = table.add({ name });
	});
	return id;
}
