<script lang="ts">
	import type { Sources } from 'quill';
	import type Quill from 'quill';
	import type Delta from 'quill-delta';
	import { onMount, createEventDispatcher } from 'svelte';

	export let onQuill: ((quill: Quill) => void) | undefined;
	export let language: string;

	let quill: Quill;
	let container: HTMLDivElement;
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

	onMount(() => {
		import('quill').then(({ default: Quill }) => {
			quill = new Quill(element, {
				modules: {
					toolbar: false
				},
				theme: 'snow'
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

			onQuill && onQuill(quill);
		});
	});
</script>

<div bind:this={container}>
	<div bind:this={element} on:keydown|capture={onKeyDown} />
</div>
