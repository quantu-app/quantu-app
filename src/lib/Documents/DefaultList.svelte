<script lang="ts">
	import type { IDocumentMeta } from '$lib/state/documents/documents';
	import type { UUID } from 'automerge';
	import DocumentMetaRow from '$lib/Documents/DocumentMetaRow.svelte';

	export let documents: [UUID, IDocumentMeta][];
	export let createOnDelete: (id: string, document: IDocumentMeta) => () => void;

	let innerWidth: number;
</script>

<svelte:window bind:innerWidth />

<table class="table">
	<thead>
		<tr>
			<th scope="col">Title</th>
			{#if innerWidth >= 768}
				<th scope="col">Created</th>
				<th scope="col">Last Updated</th>
				<th scope="col">Words</th>
				<th scope="col">Tags</th>
				<th scope="col">Language</th>
			{/if}
			<th scope="col" />
		</tr>
	</thead>
	<tbody>
		{#each documents as [id, document]}
			<DocumentMetaRow {id} {document} onDelete={createOnDelete(id, document)} />
		{/each}
	</tbody>
</table>
