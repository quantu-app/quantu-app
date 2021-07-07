<script lang="ts">
	import { goto } from '$app/navigation';
	import type { BooksStore } from '$lib/state/books';
	import { BookType } from '$lib/state/books';
	import { createEventDispatcher } from 'svelte';

	export let bookType: BookType;
	export let booksStore: BooksStore;
	export let bookNameFilter: string;

	let bookName = '';
	let bookCreating = false;

	const dispatch = createEventDispatcher<{
		bookType: BookType;
		bookNameFilter: string;
	}>();

	async function onCreateBook() {
		bookCreating = true;
		try {
			const book = await booksStore.createBook(bookType, bookName);
			goto(`/books/${book.getBookId()}`);
		} finally {
			bookCreating = false;
		}
	}

	function onBookTypeInput() {
		dispatch('bookType', bookType);
	}
	function onBookNameFilterInput() {
		dispatch('bookNameFilter', bookNameFilter);
	}
</script>

<div class="input-group mt-4">
	<!-- <select
		class="form-select"
		placeholder="New Type"
		aria-label="New Type"
		required
		bind:value={bookType}
		on:select={onBookTypeInput}
	>
		{#each Object.entries(BookType) as [key, value]}
			<option {value}>{key}</option>
		{/each}
	</select> -->
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
	<input
		type="text"
		class="form-control"
		placeholder="Filter by name"
		bind:value={bookNameFilter}
		on:input={onBookNameFilterInput}
	/>
	<button
		type="submit"
		disabled={bookCreating}
		class="btn btn-primary"
		aria-label="Update"
		on:click={onCreateBook}
	>
		{#if bookCreating}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		{/if}
		Create
	</button>
</div>
