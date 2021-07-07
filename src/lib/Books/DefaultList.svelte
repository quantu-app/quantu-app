<script lang="ts">
	import type { IBookMeta } from '$lib/state/books';
	import type { UUID } from 'automerge';
	import BookMetaRow from '$lib/Books/BookMetaRow.svelte';

	export let books: [UUID, IBookMeta][];
	export let createOnDelete: (id: string, book: IBookMeta) => () => void;
</script>

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
