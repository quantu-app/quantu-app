<script lang="ts" context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ page: { params } }) {
		return {
			props: {
				documentId: params.documentId
			}
		};
	}
</script>

<script lang="ts">
	import { pascalCase } from 'pascal-case';
	import { documentsStore } from '$lib/state/documents';
	import Document from '$lib/Document/Document.svelte';
	import Layout from '$lib/Layout.svelte';

	export let documentId: string;

	const documentStore = documentsStore.getDocumentById(documentId);

	$: documentType = $documentStore.type;
	$: documentName = $documentStore.name;
</script>

<svelte:head>
	<title>{pascalCase(documentType)} - {documentName}</title>
</svelte:head>

<Layout>
	{#if documentStore}
		<Document {documentStore} />
	{:else}
		<div class="d-flex align-items-center justify-content-center">
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		</div>
	{/if}
</Layout>
