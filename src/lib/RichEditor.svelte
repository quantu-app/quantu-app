<script lang="ts" context="module">
	import 'quill/dist/quill.core.css';
	import '$lib/editor/index.scss';
</script>

<script lang="ts">
	import type { Sources } from 'quill';
	import type Quill from 'quill';
	import type Delta from 'quill-delta';
	import { onMount, createEventDispatcher } from 'svelte';

	export let onQuill: ((quill: Quill) => void) | undefined;
	export let placeholder: string = undefined;

	let quill: Quill;
	let element: HTMLDivElement;

	const dispatch = createEventDispatcher<{
		textchange: [delta: Delta, oldContents: Delta, source: Sources];
		selectionchange: [
			range: { index: number; length: number },
			oldRange: { index: number; length: number },
			source: Sources
		];
	}>();

	function onKeyDown(e: KeyboardEvent) {
		if (e.key !== 'Backspace') {
			return;
		}

		const str = quill?.getText();
		if (str !== '' && str !== '\n') {
			e.stopPropagation();
		}
	}

	function onTextChange() {
		dispatch(
			'textchange',
			arguments as unknown as [delta: Delta, oldContents: Delta, source: Sources]
		);
	}
	function onSelectionChange() {
		dispatch(
			'selectionchange',
			arguments as unknown as [
				range: { index: number; length: number },
				oldRange: { index: number; length: number },
				source: Sources
			]
		);
	}

	onMount(() => {
		import('$lib/editor').then(({ createQuill }) => {
			quill = createQuill(element, placeholder);

			quill.on('text-change', onTextChange);
			quill.on('selection-change', onSelectionChange);

			if (onQuill) {
				onQuill(quill);
			}
		});
	});
</script>

<div class="border">
	<div bind:this={element} on:keydown|capture={onKeyDown} />
</div>
