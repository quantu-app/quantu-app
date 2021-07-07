<script lang="ts">
	import type { IBookMeta } from '$lib/state/books';
	import type { UUID } from 'automerge';
	import DefaultList from './DefaultList.svelte';

	export let books: [UUID, IBookMeta][];
	export let createOnDelete: (id: string, book: IBookMeta) => () => void;

	$: booksByMonth = Object.entries(
		books.reduce<Record<string, [UUID, IBookMeta][]>>((booksByMonth, [id, book]) => {
			const date = new Date(book.createdAt),
				month = new Date(date).toLocaleString('en-us', { month: 'short', year: 'numeric' });

			const monthBooks = booksByMonth[month] || (booksByMonth[month] = []);

			monthBooks.push([id, book]);
			return booksByMonth;
		}, {})
	);
</script>

{#each booksByMonth as [month, books]}
	<h2>{month}</h2>
	<DefaultList {books} {createOnDelete} />
{/each}
