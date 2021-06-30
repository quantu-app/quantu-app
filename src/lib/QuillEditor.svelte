<script lang="ts">
	import type { Sources } from 'quill';
	import type Quill from 'quill';
	import type Delta from 'quill-delta';
	import { onMount, createEventDispatcher } from 'svelte';

	export let multiline = true;
	export let placeholder = 'Write...';
	export let onQuill: ((quill: Quill) => void) | undefined;

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
		if (!multiline) {
			if (e.key === 'Enter') {
				e.preventDefault();
				e.stopPropagation();
			}
		}
	}

	onMount(() => {
		import('quill').then(({ default: Quill }) => {
			quill = new Quill(element, {
				modules: {
					toolbar: false
				},
				theme: 'snow',
				placeholder
			});

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

			quill.on('text-change', onTextChange);
			quill.on('selection-change', onSelectionChange);

			quill.focus();

			onQuill && onQuill(quill);
		});
	});
</script>

<div bind:this={element} on:keydown|capture={onKeyDown} />
