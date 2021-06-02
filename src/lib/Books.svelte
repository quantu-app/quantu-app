<script lang="ts">
	import { booksStore, BookType } from '$lib/state/books';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';

	let bookName: string;
	let bookType: BookType = BookType.Journal;
	let bookNameFilter: string;

	$: books = Object.entries($booksStore).filter(([_id, book]) =>
		book.type === bookType && bookNameFilter ? fuzzyEquals(bookNameFilter, book.name) : true
	);

	function onCreateBook() {
		booksStore.createBook(bookType, bookName);
	}
</script>

<div class="input-group mt-4">
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

<ul class="mt-4">
	{#each books as [id, book]}
		<li class="d-flex justify-content-between align-items-start">
			<div class="ms-2 me-auto">
				<h3 class="fw-bold">{book.name}</h3>
			</div>
			<a role="button" class="btn btn-primary" aria-label="Update" href={`/books/${id}`}> Edit </a>
		</li>
	{/each}
</ul>
