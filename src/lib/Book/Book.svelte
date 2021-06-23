<script lang="ts">
	import { booksStore, BookStore, isJournalBook, isNotesBook } from '$lib/state/books';
	import type { IBookBase } from '$lib/state/books';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { onDestroy } from 'svelte';
	import TextEditor from '$lib/TextEditor.svelte';
	import type Delta from 'quill-delta';
	import type { BinaryDocument } from 'automerge';
	import Automerge from 'automerge';
	import { applyOpsToText } from '$lib/utils';
	import Journal from './Journal.svelte';
	import Notes from './Notes.svelte';

	export let bookStore: BookStore;

	function onBookNameChange({ detail }: CustomEvent<Delta>) {
		bookStore.change((doc) => {
			applyOpsToText(doc.name, detail.ops);
		});
	}

	function onUpload() {
		const input = window.document.createElement('input');

		input.type = 'file';
		input.name = 'filename';

		document.body.appendChild(input);
		input.addEventListener('change', () => {
			const reader = new FileReader();

			reader.addEventListener('load', (e) => {
				const binaryDocument = new Uint8Array(
					e.target.result as ArrayBuffer
				) as unknown as BinaryDocument;
				binaryDocument.__binaryDocument = true;
				try {
					const fileDoc = Automerge.load<IBookBase>(binaryDocument),
						doc = bookStore.get();

					if (fileDoc.id !== doc.id) {
						throw new Error(
							`Trying to merge two documents that are not related ${fileDoc.name} and ${doc.name}`
						);
					}

					bookStore.set(Automerge.merge(doc, fileDoc));
				} catch (error) {
					console.error(error);
					addNotification({
						type: NotificationType.Danger,
						heading: 'Failed to Upload',
						description: error.message
					});
				}
			});
			reader.readAsArrayBuffer(input.files[0]);
		});
		input.click();
		document.body.removeChild(input);
	}

	function onDownload() {
		const binaryDocument = Automerge.save($bookStore),
			a = window.document.createElement('a');

		a.href = window.URL.createObjectURL(
			new Blob([binaryDocument], { type: 'application/octet-stream' })
		);
		a.download = `${$bookStore.name}.book`;

		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	onDestroy(() => {
		const bookId = bookStore.get().id;
		// Run after sub components unmount to allow update before closing
		setTimeout(() => {
			booksStore.unloadBookById(bookId);
		});
	});
</script>

<h1 class="d-flex flex-row">
	<TextEditor text={$bookStore.name} on:textchange={onBookNameChange} />
	<div class="flex-grow-1" />
	<div class="btn-group" role="group">
		<button class="btn btn-primary" role="button" on:click={onDownload}>
			<i class="bi bi-download" />
		</button>
		<button class="btn btn-primary" role="button" on:click={onUpload}>
			<i class="bi bi-upload" />
		</button>
	</div>
</h1>

{#if isJournalBook($bookStore)}
	<Journal bookStore={bookStore.asJournalBook()} />
{:else if isNotesBook($bookStore)}
	<Notes bookStore={bookStore.asNotesBook()} />
{/if}
