<script lang="ts">
	import type { IJournalBook } from '$lib/state/books';
	import type { BookStore } from '$lib/state/books';
	import TextEditor from '$lib/TextEditor.svelte';
	import type Delta from 'quill-delta';
	import { applyOpsToText } from '$lib/utils';
	import Blocks from './Blocks.svelte';

	export let bookStore: BookStore<IJournalBook>;

	function onBookLocationChange({ detail }: CustomEvent<Delta>) {
		bookStore.change((doc) => {
			applyOpsToText(doc.location, detail.ops);
		});
	}
</script>

<h3>
	<TextEditor text={$bookStore.location} on:textchange={onBookLocationChange} />
</h3>

<Blocks {bookStore} />
