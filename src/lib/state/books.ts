import { Table, Text } from 'automerge';
import { persistentStore } from './persistentStore';

export interface IBook {
	name: Text;
}

export const booksStore = persistentStore('books', {
	table: new Table<IBook>()
});

export function createBook(name: string) {
	let id: string;
	booksStore.change(({ table }) => {
		id = table.add({ name: new Text(name) });
	});
	return id;
}
