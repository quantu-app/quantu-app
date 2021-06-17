<script lang="ts">
	import type { INotesBook } from '$lib/state/books';
	import type { BookStore } from '$lib/state/books';
	import Blocks from './Blocks.svelte';
	import CreateBlock from './CreateBlock.svelte';

	export let bookStore: BookStore<INotesBook>;
</script>

<Blocks {bookStore} />

<CreateBlock {bookStore} />
