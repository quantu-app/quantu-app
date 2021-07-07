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

	let settings = false;

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

<div class="container">
	<div class="row justify-content-between align-items-end">
		<div class="col-auto ps-0">
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
		<div class="col-auto pe-0">
			<div class="btn-group" role="group">
				<button
					class={`btn btn-${settings ? 'primary' : 'secondary'}`}
					role="button"
					on:click={() => (settings = !settings)}
				>
					<i class="bi bi-gear" />
				</button>
			</div>
		</div>
	</div>
</div>
<hr />

{#if bookMeta && settings}
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
{/if}

<Blocks {bookStore} />

{#if !isJournalBook($bookStore)}
	<CreateBlock {bookStore} />
{/if}
