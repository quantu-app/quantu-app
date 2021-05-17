import { v4 } from 'uuid';
import { persistentStore } from './persistentStore';

export interface IBook {
	id: string;
	name: string;
}

export interface IBooks {
	byId: Record<string, IBook>;
}

export const booksStore = persistentStore<IBooks>('books', {
	byId: {}
});

export function createBook(name: string) {
	const book: IBook = {
		id: v4(),
		name
	};

	booksStore.update((state) => {
		state.byId[book.id] = book;
		return state;
	});
}
