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
	import BookMetaRow from './BookMetaRow.svelte';

	let bookName: string;

	let prevBookType: BookType = $state.bookType;
	let prevBookNameFilter: string = $state.bookNameFilter;

	let bookSortBy = 'createdAt';
	let prevBookSortBy = bookSortBy;

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

	function onCreateBook() {
		booksStore.createBook($state.bookType, bookName);
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
			bookSortBy !== prevBookSortBy ||
			$state.bookType !== prevBookType
		) {
			prevBookType = $state.bookType;
			prevBookNameFilter = $state.bookNameFilter;
			prevBookSortBy = bookSortBy;
			books = Object.entries($booksStore).filter(filter).sort(sort);
		}
	});
</script>

<div class="input-group mt-4">
	<select
		class="form-select"
		placeholder="New Type"
		aria-label="New Type"
		required
		bind:value={$state.bookType}
	>
		{#each Object.entries(BookType) as [key, value]}
			<option {value}>{key}</option>
		{/each}
	</select>
	{#if $state.bookType !== BookType.Journal}
		<input
			type="text"
			class="form-control"
			placeholder="New Name"
			aria-label="New Name"
			required
			bind:value={bookName}
		/>
	{/if}
	<button type="submit" class="btn btn-primary" aria-label="Update" on:click={onCreateBook}>
		Create
	</button>
</div>

<div class="input-group mt-4">
	<input
		type="search"
		class="form-control"
		placeholder="Filter by name"
		bind:value={$state.bookNameFilter}
	/>
</div>

<div
	class="modal fade"
	id="delete-book"
	tabindex="-1"
	aria-labelledby="delete-book-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="delete-book-label" class="modal-title">Delete {deleteBook?.name}</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="input-group mt-4">
					<input
						type="search"
						class="form-control"
						placeholder="Type delete to permanently remove."
						bind:value={deleteBookText}
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={onDeleteBook}
					disabled={deleteBookText.trim().toLowerCase() !== 'delete'}
					data-bs-dismiss="modal"
					class="btn btn-danger">Delete</button
				>
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>

<table class="table">
	<thead>
		<tr>
			<th scope="col">Title</th>
			<th scope="col">Created</th>
			<th scope="col">Last Updated</th>
			<th scope="col">Words</th>
			<th scope="col">Tags</th>
			<th scope="col">Language</th>
			<th scope="col" />
		</tr>
	</thead>
	<tbody>
		{#each books as [id, book]}
			<BookMetaRow {id} {book} onDelete={createOnDelete(id, book)} />
		{/each}
	</tbody>
</table>
