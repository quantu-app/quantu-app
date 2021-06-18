<script lang="ts">
	import type { ITextBlock } from '$lib/state/blocks';
	import type { BookStore } from '$lib/state/books';
	import RichEditor from '$lib/RichEditor.svelte';
	import { beforeUpdate, onMount } from 'svelte';
	import { debounce } from '@aicacia/debounce';
	import type { TableRow } from 'automerge';
	import type Delta from 'quill-delta';
	import type Quill from 'quill';
	import deepDiff from 'deep-diff';

	export let bookStore: BookStore;
	export let block: ITextBlock & TableRow;

	let prevBlock = block;
	let quill: Quill;
	let DeltaClass: typeof Delta;

	function onQuill(q: Quill) {
		quill = q;
		if (DeltaClass) {
			quill.setContents(new DeltaClass(block.text), 'silent');
		}
	}

	function updateBlockText() {
		if (quill) {
			bookStore.updateBlock(block.id, (block) => {
				deepDiff.applyDiff(block.text, quill.getContents().ops);
			});
		}
	}

	const debouncedUpdateBlockText = debounce(updateBlockText, 5000);

	function onTextChange({
		detail: [_delta, _oldContents, source]
	}: CustomEvent<[delta: Delta, oldContents: Delta, source: string]>) {
		if (source === 'user') {
			debouncedUpdateBlockText();
		}
	}

	beforeUpdate(() => {
		if (prevBlock.id !== block.id && quill && DeltaClass) {
			quill.setContents(new DeltaClass(block.text), 'silent');
		}
	});

	onMount(async () => {
		const module = await import('quill-delta');
		DeltaClass = module.default;
		if (quill) {
			quill.setContents(new DeltaClass(block.text), 'silent');
		}
	});
</script>

<RichEditor {onQuill} on:textchange={onTextChange} />
