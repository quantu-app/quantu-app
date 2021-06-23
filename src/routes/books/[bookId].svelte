<script lang="ts" context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ page: { params } }) {
		return {
			props: {
				bookId: params.bookId
			}
		};
	}
</script>

<script lang="ts">
	import { pascalCase } from 'pascal-case';
	import { booksStore } from '$lib/state/books';
	import Book from '$lib/Book/Book.svelte';

	export let bookId: string;

	const bookStore = booksStore.getBookById(bookId);

	$: bookType = $bookStore.type;
	$: bookName = $bookStore.name;
</script>

<svelte:head>
	<title>{pascalCase(bookType)} - {bookName}</title>
</svelte:head>

<div class="container">
	{#if bookStore}
		<Book {bookStore} />
	{:else}
		<div class="d-flex align-items-center justify-content-center">
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		</div>
	{/if}
</div>
