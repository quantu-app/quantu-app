<script lang="ts">
	import { booksStore, BookType } from '$lib/state/books';
	import type { IBookMeta } from '$lib/state/books';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import type { UUID } from 'automerge';
	import { beforeUpdate } from 'svelte';

	let bookName: string;

	let bookType: BookType = BookType.Journal;
	let prevBookType: BookType = bookType;

	let bookNameFilter: string;
	let prevBookNameFilter: string;

	let bookSortBy = 'createdAt';
	let prevBookSortBy = bookSortBy;

	let deleteBookId: UUID;
	let deleteBook: IBookMeta;
	let deleteBookName = '';

	$: books = Object.entries($booksStore).filter(filter).sort(sort);

	function filter([_id, book]: [UUID, IBookMeta]) {
		return (
			book.type === bookType && (bookNameFilter ? fuzzyEquals(bookNameFilter, book.name) : true)
		);
	}

	function sort([_aId, aBook]: [UUID, IBookMeta], [_bId, bBook]: [UUID, IBookMeta]) {
		let aValue = new Date(aBook.createdAt),
			bValue = new Date(bBook.createdAt);
		return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
	}

	function onCreateBook() {
		booksStore.createBook(bookType, bookName);
	}

	function createOnDelete(bookId: string, book: IBookMeta) {
		return function onDelete() {
			deleteBookId = bookId;
			deleteBook = book;
			deleteBookName = '';
		};
	}

	function onDeleteBook() {
		if (deleteBookId) {
			booksStore.deleteBookById(deleteBookId);
		}
	}

	beforeUpdate(() => {
		if (
			bookNameFilter !== prevBookNameFilter ||
			bookSortBy !== prevBookSortBy ||
			bookType !== prevBookType
		) {
			prevBookType = bookType;
			prevBookNameFilter = bookNameFilter;
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
		bind:value={bookType}
	>
		{#each Object.entries(BookType) as [key, value]}
			<option {value}>{key}</option>
		{/each}
	</select>
	{#if bookType !== BookType.Journal}
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
		bind:value={bookNameFilter}
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
				<p>Type <code>{deleteBook?.name}</code> to Delete.</p>
				<div class="input-group mt-4">
					<input
						type="search"
						class="form-control"
						placeholder="Name to Delete"
						bind:value={deleteBookName}
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={onDeleteBook}
					disabled={deleteBookName.trim() !== deleteBook?.name.trim()}
					data-bs-dismiss="modal"
					class="btn btn-danger">Delete</button
				>
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>

<ul class="list-group list-group-flush mt-4">
	{#each books as [id, book]}
		<li class="d-flex justify-content-between align-items-start list-group-item">
			<div>
				<h3>{book.name}</h3>
			</div>
			<div class="btn-group" role="group">
				<a type="button" class="btn btn-primary" aria-label="Edit" href={`/books/${id}`}
					><i class="bi bi-pencil" /></a
				>
				<button
					type="button"
					class="btn btn-danger"
					data-bs-toggle="modal"
					data-bs-target="#delete-book"
					aria-label="Delete"
					on:click={createOnDelete(id, book)}><i class="bi bi-trash" /></button
				>
			</div>
		</li>
	{/each}
</ul>
