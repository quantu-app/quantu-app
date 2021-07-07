<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		bookType: BookType;
		bookNameFilter: string | undefined;
	}

	const state = writable<IState>({
		bookType: BookType.Journal,
		bookNameFilter: undefined
	});
</script>

<script lang="ts">
	import { booksStore, BookType } from '$lib/state/books';
	import type { IBookMeta } from '$lib/state/books';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import type { UUID } from 'automerge';
	import { beforeUpdate } from 'svelte';
	import DeleteBook from '$lib/Books/DeleteBook.svelte';
	import SearchBar from '$lib/Books/SearchBar.svelte';
	import JournalList from './JournalList.svelte';
	import DefaultList from './DefaultList.svelte';

	let prevBookType: BookType = $state.bookType;
	let prevBookNameFilter: string = $state.bookNameFilter;
	let prevBooks = $booksStore;

	let deleteBookId: UUID;
	let deleteBook: IBookMeta;
	let deleteBookText = '';

	$: books = Object.entries($booksStore).filter(filter).sort(sort);

	function filter([_id, book]: [UUID, IBookMeta]) {
		return (
			book.type === $state.bookType &&
			($state.bookNameFilter ? fuzzyEquals($state.bookNameFilter, book.name) : true)
		);
	}

	function sort([_aId, aBook]: [UUID, IBookMeta], [_bId, bBook]: [UUID, IBookMeta]) {
		let aValue = new Date(aBook.createdAt),
			bValue = new Date(bBook.createdAt);
		return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
	}

	function createOnDelete(bookId: string, book: IBookMeta) {
		return function onDelete() {
			deleteBookId = bookId;
			deleteBook = book;
			deleteBookText = '';
		};
	}

	function onDeleteBook() {
		if (deleteBookId) {
			booksStore.deleteBookById(deleteBookId);
		}
	}

	beforeUpdate(() => {
		if (
			$state.bookNameFilter !== prevBookNameFilter ||
			$state.bookType !== prevBookType ||
			prevBooks !== $booksStore
		) {
			prevBookType = $state.bookType;
			prevBookNameFilter = $state.bookNameFilter;
			books = Object.entries($booksStore).filter(filter).sort(sort);
		}
	});
</script>

<SearchBar
	{booksStore}
	bookType={$state.bookType}
	bookNameFilter={$state.bookNameFilter}
	on:bookType={(e) => ($state.bookType = e.detail)}
	on:bookNameFilter={(e) => ($state.bookNameFilter = e.detail)}
/>

<DeleteBook {deleteBook} {deleteBookText} {onDeleteBook} />

{#if $state.bookType === BookType.Journal}
	<JournalList {books} {createOnDelete} />
{:else}
	<DefaultList {books} {createOnDelete} />
{/if}
