import { Table, TableRow, Text, uuid } from 'automerge';
import { persistentStore } from './persistentStore';

export interface IBook {
	uuid: string;
	name: Text;
}

export interface IBookJSON {
	uuid: string;
	name: string;
}

export function bookToJSON(book: IBook & TableRow): IBookJSON {
	return {
		uuid: book.uuid,
		name: book.name.toString()
	};
}

export function bookFromJSON(json: IBookJSON) {
	return {
		uuid: json.uuid,
		name: new Text(json.name)
	};
}

export const booksStore = persistentStore('books', {
	table: new Table<IBook>()
});

export function createBook(name: string) {
	const id = uuid();
	booksStore.change(({ table }) => {
		table.add({ uuid: id, name: new Text(name) });
	});
	return id;
}
