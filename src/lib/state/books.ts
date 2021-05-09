import { Table, TableRow, Text } from 'automerge';
import { persistentStore } from './persistentStore';

export interface IBook {
	name: Text;
}

export interface IBookJSON {
	id: string;
	name: string;
}

export function bookToJSON(book: IBook & TableRow): IBookJSON {
	return {
		id: book.id,
		name: book.name.toString()
	};
}

export function bookFromJSON(json: IBookJSON) {
	return {
		id: json.id,
		name: new Text(json.name)
	};
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
