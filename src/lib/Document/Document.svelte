<script lang="ts">
	import type { DocumentStore } from '$lib/state/documents/DocumentStore';
	import { isJournalDocument } from '$lib/state/documents/documents';
	import { documentsStore } from '$lib/state/documents';
	import type { IJournalDocument } from '$lib/state/documents/documents';
	import { onDestroy } from 'svelte';
	import TextEditor from '$lib/TextEditor.svelte';
	import type Delta from 'quill-delta';
	import { applyOpsToText } from '$lib/utils';
	import Blocks from './Blocks.svelte';
	import CreateBlock from './CreateBlock.svelte';
	import Tags from '$lib/Tags.svelte';

	export let documentStore: DocumentStore;

	$: documentId = $documentStore.id;
	$: documentMeta = $documentsStore[documentId];

	function onLanguageChange(e: Event) {
		const value = (e.currentTarget as HTMLInputElement).value;
		documentsStore.updateDocument(documentId, (_documentMeta) => ({
			language: value
		}));
	}

	function onTagsChange(e: CustomEvent<string[]>) {
		documentsStore.updateDocument(documentId, (_documentMeta) => ({
			tags: e.detail
		}));
	}

	function onDocumentNameChange({ detail }: CustomEvent<Delta>) {
		documentStore.change((doc) => {
			applyOpsToText(doc.name, detail.ops);
		});
	}

	function onDocumentLocationChange({ detail }: CustomEvent<Delta>) {
		documentStore.change((doc) => {
			applyOpsToText((doc as IJournalDocument).location, detail.ops);
		});
	}

	onDestroy(() => {
		const documentId = documentStore.get().id;
		// Run after sub components unmount to allow update before closing
		setTimeout(() => {
			documentsStore.unloadDocumentById(documentId);
		});
	});
</script>

<div class="row justify-content-between align-items-end">
	<div class="col-auto">
		<h1>
			<TextEditor text={$documentStore.name} on:textchange={onDocumentNameChange} />
		</h1>
	</div>
	{#if isJournalDocument($documentStore)}
		<div class="col-auto">
			<h3>
				<TextEditor text={$documentStore.location} on:textchange={onDocumentLocationChange} />
			</h3>
		</div>
	{/if}
	<div class="col-auto">
		<button
			type="button"
			role="button"
			class="btn btn-primary"
			data-bs-toggle="modal"
			data-bs-target="#document-settings"
			aria-label="Document Settings"><i class="bi bi-gear" /></button
		>
	</div>
</div>
<hr />

<div
	class="modal fade"
	id="document-settings"
	tabindex="-1"
	aria-labelledby="document-settings-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="document-settings-label" class="modal-title">Settings</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="input-group">
					<input
						type="text"
						class="form-control"
						placeholder="Enter langauge"
						value={documentMeta?.language}
						on:change={onLanguageChange}
					/>
				</div>
				<div class="input-group mt-4">
					<Tags tags={documentMeta?.tags || []} on:change={onTagsChange} />
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>

<div class="container-md">
	<Blocks {documentStore} />

	{#if !isJournalDocument($documentStore)}
		<CreateBlock {documentStore} />
	{/if}
</div>
