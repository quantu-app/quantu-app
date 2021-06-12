<script lang="ts">
	import { booksStore, BookStore, isJournalBook, isNotesBook } from '$lib/state/books';
	import { onMount } from 'svelte';
	import TextEditor from '$lib/TextEditor.svelte';
	import type Delta from 'quill-delta';
	import { applyOpsToText } from '$lib/utils';
	import Journal from './Journal.svelte';
	import Notes from './Notes.svelte';

	export let bookStore: BookStore;

	function onBookNameChange({ detail }: CustomEvent<Delta>) {
		bookStore.change((doc) => {
			applyOpsToText(doc.name, detail.ops);
		});
	}

	onMount(() => {
		return () => {
			booksStore.unloadBookById(bookStore.get().id);
		};
	});
</script>

<h1>
	<TextEditor text={$bookStore.name} on:textchange={onBookNameChange} />
</h1>

{#if isJournalBook($bookStore)}
	<Journal bookStore={bookStore.asJournalBook()} />
{:else if isNotesBook($bookStore)}
	<Notes bookStore={bookStore.asNotesBook()} />
{/if}
