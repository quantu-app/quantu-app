<script lang="ts">
	import type { ITextBlock } from '$lib/state/blocks';
	import type { BookStore } from '$lib/state/books';
	import QuillEditor from '$lib/QuillEditor.svelte';
	import { beforeUpdate, onMount } from 'svelte';
	import type { TableRow } from 'automerge';
	import type Delta from 'quill-delta';
	import type Quill from 'quill';

	export let bookStore: BookStore;
	export let block: ITextBlock & TableRow;

	let prevBlock = block;
	let quill: Quill;
	let DeltaClass: typeof Delta;

	function onQuill(q: Quill) {
		quill = q;
		quill.setContents(new DeltaClass(block.text), 'silent');
	}

	beforeUpdate(() => {
		if (prevBlock.id !== block.id) {
			quill.setContents(new DeltaClass(block.text), 'silent');
		}
	});

	onMount(async () => {
		const module = await import('quill-delta');
		DeltaClass = module.default;
	});

	function onTextChange({
		detail: [delta, oldContents, source]
	}: CustomEvent<[delta: Delta, oldContents: Delta, source: string]>) {
		if (quill && source === 'user') {
			bookStore.updateBlock(block.id, (block) => {
				block.text = quill.getContents().ops.map((op) => ({ ...op }));
			});
		}
	}
</script>

<QuillEditor {onQuill} on:textchange={onTextChange} />
