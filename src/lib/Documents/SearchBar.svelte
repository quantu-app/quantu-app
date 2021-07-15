<script lang="ts">
	import { goto } from '$app/navigation';
	import type { DocumentsStore } from '$lib/state/documents/DocumentsStore';
	import { DocumentType } from '$lib/state/documents/documents';

	export let documentType: DocumentType;
	export let documentsStore: DocumentsStore;
	export let documentNameFilter: string;

	let documentName = '';
	let documentCreating = false;

	async function onCreateDocument() {
		documentCreating = true;
		try {
			const document = await documentsStore.createDocument(documentType, documentName);
			goto(`/documents/${document.getDocumentId()}`);
		} finally {
			documentCreating = false;
		}
	}
</script>

<div class="input-group mt-4">
	<select
		class="form-select"
		placeholder="New Type"
		aria-label="New Type"
		required
		bind:value={documentType}
	>
		{#each Object.entries(DocumentType) as [key, value]}
			<option {value}>{key}</option>
		{/each}
	</select>
	{#if documentType !== DocumentType.Journal}
		<input
			type="text"
			class="form-control"
			placeholder="New Name"
			aria-label="New Name"
			required
			bind:value={documentName}
		/>
	{/if}
</div>
<div class="input-group mt-4 mb-4">
	<input
		type="text"
		class="form-control"
		placeholder="Filter by name"
		bind:value={documentNameFilter}
	/>
	<button
		type="submit"
		disabled={documentCreating}
		class="btn btn-primary"
		aria-label="Update"
		on:click={onCreateDocument}
	>
		{#if documentCreating}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		{/if}
		Create
	</button>
</div>
