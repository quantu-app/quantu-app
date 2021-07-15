<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		documentType: DocumentType;
		documentNameFilter: string | undefined;
	}

	const state = writable<IState>({
		documentType: DocumentType.Journal,
		documentNameFilter: undefined
	});
</script>

<script lang="ts">
	import { DocumentType } from '$lib/state/documents/documents';
	import type { IDocumentMeta } from '$lib/state/documents/documents';
	import { documentsStore } from '$lib/state/documents';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import type { UUID } from 'automerge';
	import { beforeUpdate } from 'svelte';
	import DeleteDocument from '$lib/Documents/DeleteDocument.svelte';
	import SearchBar from '$lib/Documents/SearchBar.svelte';
	import JournalList from './JournalList.svelte';
	import DefaultList from './DefaultList.svelte';

	let prevDocumentType: DocumentType = $state.documentType;
	let prevDocumentNameFilter: string = $state.documentNameFilter;
	let prevDocuments = $documentsStore;

	let deleteDocumentId: UUID;
	let deleteDocument: IDocumentMeta;
	let deleteDocumentText = '';

	$: documents = Object.entries($documentsStore).filter(filter).sort(sort);

	function filter([_id, document]: [UUID, IDocumentMeta]) {
		return (
			document.type === $state.documentType &&
			($state.documentNameFilter ? fuzzyEquals($state.documentNameFilter, document.name) : true)
		);
	}

	function sort(
		[_aId, aDocument]: [UUID, IDocumentMeta],
		[_bId, bDocument]: [UUID, IDocumentMeta]
	) {
		let aValue = new Date(aDocument.insertedAt),
			bValue = new Date(bDocument.insertedAt);
		return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
	}

	function createOnDelete(documentId: string, document: IDocumentMeta) {
		return function onDelete() {
			deleteDocumentId = documentId;
			deleteDocument = document;
			deleteDocumentText = '';
		};
	}

	function onDeleteDocument() {
		if (deleteDocumentId) {
			documentsStore.deleteDocumentById(deleteDocumentId);
		}
	}

	beforeUpdate(() => {
		if (
			$state.documentNameFilter !== prevDocumentNameFilter ||
			$state.documentType !== prevDocumentType ||
			prevDocuments !== $documentsStore
		) {
			prevDocumentType = $state.documentType;
			prevDocumentNameFilter = $state.documentNameFilter;
			documents = Object.entries($documentsStore).filter(filter).sort(sort);
		}
	});
</script>

<SearchBar
	{documentsStore}
	bind:documentType={$state.documentType}
	bind:documentNameFilter={$state.documentNameFilter}
/>

<DeleteDocument {deleteDocument} {deleteDocumentText} {onDeleteDocument} />

<div class="w-100">
	{#if $state.documentType === DocumentType.Journal}
		<JournalList {documents} {createOnDelete} />
	{:else}
		<DefaultList {documents} {createOnDelete} />
	{/if}
</div>
