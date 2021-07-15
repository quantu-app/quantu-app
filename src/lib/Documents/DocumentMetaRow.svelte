<script lang="ts">
	import type { IDocumentMeta } from '$lib/state/documents/documents';

	export let id: string;
	export let document: IDocumentMeta;
	export let onDelete: () => void;

	let innerWidth: number;

	$: insertedAt = new Date(document.insertedAt || '');
	$: updatedAt = new Date(document.updatedAt || '');
</script>

<svelte:window bind:innerWidth />

<tr>
	<th scope="row">{document.name}</th>
	{#if innerWidth >= 768}
		<td>{insertedAt.toLocaleTimeString()} {insertedAt.toLocaleDateString()}</td>
		<td>{updatedAt.toLocaleTimeString()} {updatedAt.toLocaleDateString()}</td>
		<td>{document.wordCount || 0}</td>
		<td>{(document.tags || []).join(', ')}</td>
		<td>{(document.language || '').toUpperCase()}</td>
	{/if}
	<td class="clearfix">
		<div class="btn-group float-end" role="group">
			<a type="button" class="btn btn-primary" aria-label="Edit" href={`/documents/${id}`}
				><i class="bi bi-pencil" /></a
			>
			<button
				type="button"
				class="btn btn-danger text-white"
				data-bs-toggle="modal"
				data-bs-target="#delete-document"
				aria-label="Delete"
				on:click={onDelete}><i class="bi bi-trash" /></button
			>
		</div>
	</td>
</tr>
