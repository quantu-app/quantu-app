<script lang="ts">
	import type Quill from 'quill';
	import type Delta from 'quill-delta';
	import { onDestroy, onMount } from 'svelte';

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

	onDestroy(() => {
		if (quill) {
			quill.getModule('toolbar').container.remove();
		}
	});

	onMount(async () => {
		const { default: Quill } = await import('quill');

		quill = new Quill(container, {
			theme: 'snow',
			modules: {
				toolbar: [
					['bold', 'italic', 'underline', 'strike'],
					['blockquote', 'code-block'],

					[{ header: 1 }, { header: 2 }],
					[{ list: 'ordered' }, { list: 'bullet' }],
					[{ script: 'sub' }, { script: 'super' }],
					[{ indent: '-1' }, { indent: '+1' }],
					[{ direction: 'rtl' }],

					[{ size: ['small', false, 'large', 'huge'] }],
					[{ header: [1, 2, 3, 4, 5, 6, false] }],

					[{ color: [] }, { background: [] }],
					[{ font: [] }],
					[{ align: [] }],

					['clean']
				]
			}
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
