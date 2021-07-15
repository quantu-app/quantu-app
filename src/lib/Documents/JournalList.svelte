<script lang="ts">
	import type { IDocumentMeta } from '$lib/state/documents/documents';
	import type { UUID } from 'automerge';
	import DefaultList from './DefaultList.svelte';

	export let documents: [UUID, IDocumentMeta][];
	export let createOnDelete: (id: string, document: IDocumentMeta) => () => void;

	$: documentsByMonth = Object.entries(
		documents.reduce<Record<string, [UUID, IDocumentMeta][]>>(
			(documentsByMonth, [id, document]) => {
				const date = new Date(document.insertedAt),
					month = new Date(date).toLocaleString('en-us', { month: 'short', year: 'numeric' });

				const monthDocuments = documentsByMonth[month] || (documentsByMonth[month] = []);

				monthDocuments.push([id, document]);
				return documentsByMonth;
			},
			{}
		)
	);
</script>

{#each documentsByMonth as [month, documents]}
	<h2>{month}</h2>
	<DefaultList {documents} {createOnDelete} />
{/each}
