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
	let updating = false;

	function onQuill(q: Quill) {
		quill = q;
		if (DeltaClass) {
			quill.setContents(new DeltaClass(block.text), 'silent');
		}
	}

	function updateBlockText() {
		if (quill && updating) {
			// TODO: fix this so it doesnt throw errors when the sizes are not the same
			bookStore.updateBlock(block.id, (block) => {
				const ops = quill.getContents().ops;
				try {
					deepDiff.applyDiff(block.text, ops);
				} catch (error) {
					console.error(error);
					block.text = ops;
				}
			});
			updating = false;
		}
	}

	const debouncedUpdateBlockText = debounce(updateBlockText, 5000);

	function onTextChange({
		detail: [_delta, _oldContents, source]
	}: CustomEvent<[delta: Delta, oldContents: Delta, source: string]>) {
		if (source === 'user') {
			updating = true;
			debouncedUpdateBlockText();
		}
	}

	beforeUpdate(() => {
		if (prevBlock.id !== block.id && quill && DeltaClass) {
			quill.setContents(new DeltaClass(block.text), 'silent');
		}
	});

	onMount(() => {
		import('quill-delta').then(({ default: DeltaClass }) => {
			if (quill) {
				quill.setContents(new DeltaClass(block.text), 'silent');
			}
		});

		return updateBlockText;
	});
</script>

<RichEditor {onQuill} on:textchange={onTextChange} />
