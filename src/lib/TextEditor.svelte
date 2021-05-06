<script lang="ts">
	import type Quill from 'quill';
	import type Delta from 'quill-delta';
	import { onMount } from 'svelte';

	export let text: string;
	let prevText: string;
	export let onTextChange: (delta: Delta) => void;

	let quill: Quill;
	let container: HTMLDivElement;

	$: {
		if (text !== prevText && quill) {
			prevText = text;
			quill.setText(text);
		}
	}

	onMount(async () => {
		const { default: Quill } = await import('quill');

		quill = new Quill(container, {
			modules: {
				toolbar: false
			},
			theme: 'snow'
		});

		if (text) {
			quill.setText(text);
		}

		function onChange(delta: Delta, _oldContents: Delta, source: string) {
			if (source === 'user') {
				onTextChange(delta);
			}
		}

		function onKeyDown(e: KeyboardEvent) {
			if (e.key === 'Backspace') {
				const str = quill.getText();
				if (str !== '' && str !== '\n') {
					e.stopPropagation();
				}
			}
		}

		quill.on('text-change', onChange);

		container.addEventListener('keydown', onKeyDown, { capture: true });
	});
</script>

<div bind:this={container} />
