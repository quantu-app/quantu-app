<script lang="ts">
	import type Quill from 'quill';
	import type Delta from 'quill-delta';
	import { onMount, createEventDispatcher } from 'svelte';

	export let text: string;
	export let multiline = true;
	let prevText: string;

	const dispatch = createEventDispatcher<{ textchange: Delta }>();

	let quill: Quill;
	let element: HTMLDivElement;

	$: {
		if (text !== prevText && quill) {
			prevText = text;
			quill.setText(text);
		}
	}

	onMount(async () => {
		const { default: Quill } = await import('quill');

		quill = new Quill(element, {
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
				dispatch('textchange', delta);
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

		element.addEventListener('keydown', onKeyDown, { capture: true });
	});
</script>

<div bind:this={element} />
