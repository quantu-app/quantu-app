<script lang="ts">
	import { booksStore, BookStore, isJournalBook } from '$lib/state/books';
	import type { IJournalBook } from '$lib/state/books';
	import { onDestroy } from 'svelte';
	import TextEditor from '$lib/TextEditor.svelte';
	import type Delta from 'quill-delta';
	import { applyOpsToText } from '$lib/utils';
	import Blocks from './Blocks.svelte';
	import CreateBlock from './CreateBlock.svelte';
	import Tags from '$lib/Tags.svelte';

	export let bookStore: BookStore;

	$: bookId = $bookStore.id;
	$: bookMeta = $booksStore[bookId];

	function onLanguageChange(e: Event) {
		const value = (e.currentTarget as HTMLInputElement).value;
		booksStore.updateBook(bookId, (bookMeta) => ({
			...bookMeta,
			language: value
		}));
	}

	function onTagsChange(e: CustomEvent<string[]>) {
		booksStore.updateBook(bookId, (bookMeta) => ({
			...bookMeta,
			tags: e.detail
		}));
	}

	function onBookNameChange({ detail }: CustomEvent<Delta>) {
		bookStore.change((doc) => {
			applyOpsToText(doc.name, detail.ops);
		});
	}

	function onBookLocationChange({ detail }: CustomEvent<Delta>) {
		bookStore.change((doc) => {
			applyOpsToText((doc as IJournalBook).location, detail.ops);
		});
	}

	onDestroy(() => {
		const bookId = bookStore.get().id;
		// Run after sub components unmount to allow update before closing
		setTimeout(() => {
			booksStore.unloadBookById(bookId);
		});
	});
</script>

<div class="d-flex flex-row">
	<div class="d-flex flex-column flex-shrink-0 p-3">
		<a href="/" class="navbar-brand" role="button">Q[U]</a>
	</div>
	<div class="d-flex flex-column flex-grow-1 pe-3">
		<div class="row justify-content-between align-items-end">
			<div class="col-auto">
				<h1>
					<TextEditor text={$bookStore.name} on:textchange={onBookNameChange} />
				</h1>
			</div>
			{#if isJournalBook($bookStore)}
				<div class="col-auto">
					<h3>
						<TextEditor text={$bookStore.location} on:textchange={onBookLocationChange} />
					</h3>
				</div>
			{/if}
			<div class="col-auto">
				<button
					type="button"
					role="button"
					class="btn btn-primary"
					data-bs-toggle="modal"
					data-bs-target="#book-settings"
					aria-label="Book Settings"><i class="bi bi-gear" /></button
				>
			</div>
		</div>
		<hr />
	</div>
</div>

<div
	class="modal fade"
	id="book-settings"
	tabindex="-1"
	aria-labelledby="book-settings-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="book-settings-label" class="modal-title">Settings</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="input-group">
					<input
						type="text"
						class="form-control"
						placeholder="Enter langauge"
						value={bookMeta.language}
						on:change={onLanguageChange}
					/>
				</div>
				<div class="input-group mt-4">
					<Tags tags={bookMeta.tags} on:change={onTagsChange} />
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>

<div class="container-md">
	<Blocks {bookStore} />

	{#if !isJournalBook($bookStore)}
		<CreateBlock {bookStore} />
	{/if}
</div>
