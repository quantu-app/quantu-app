<script lang="ts">
	import type { IBookMeta } from '$lib/state/books';
	import type { UUID } from 'automerge';
	import DefaultList from './DefaultList.svelte';

	export let books: [UUID, IBookMeta][];
	export let createOnDelete: (id: string, book: IBookMeta) => () => void;

	$: booksByMonth = books.reduce<Record<string, [UUID, IBookMeta][]>>(
		(booksByMonth, [id, book]) => {
			const date = new Date(book.createdAt),
				monthDate = new Date(0);

			monthDate.setFullYear(date.getFullYear());
			monthDate.setMonth(date.getMonth());

			const monthDateJSON = monthDate.toJSON(),
				monthBooks = booksByMonth[monthDateJSON] || (booksByMonth[monthDateJSON] = []);
			monthBooks.push([id, book]);
			return booksByMonth;
		},
		{}
	);
</script>

{#each Object.entries(booksByMonth) as [month, books]}
	<h2>{new Date(month).toLocaleString('en-us', { month: 'short', year: 'numeric' })}</h2>
	<DefaultList {books} {createOnDelete} />
{/each}
