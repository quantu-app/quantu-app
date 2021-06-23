<script context="module" lang="ts">
	const toolbarOptions = [
		[
			{
				header: [false, 3, 2, 1]
			}
		],
		['bold', 'italic', 'underline', 'strike'],
		['blockquote', 'code-block', 'formula'],
		[
			{
				list: 'ordered'
			},
			{
				list: 'bullet'
			}
		],
		[
			{
				align: []
			}
		],
		['link', 'image'],
		['clean']
	];
</script>

<script lang="ts">
	import type { Sources } from 'quill';
	import type Quill from 'quill';
	import type Delta from 'quill-delta';
	import { onMount, createEventDispatcher, beforeUpdate } from 'svelte';

	export let onQuill: ((quill: Quill) => void) | undefined;

	let quill: Quill;
	let container: HTMLDivElement;
	let element: HTMLDivElement;
	let edit = false;
	let prevEdit: boolean;

	const dispatch = createEventDispatcher<{
		textchange: [delta: Delta, oldContents: Delta, source: Sources];
		selectionchange: [
			range: { index: number; length: number },
			oldRange: { index: number; length: number },
			source: Sources
		];
	}>();

	function onWindowClick() {
		edit = false;
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key !== 'Backspace') {
			return;
		}

		const str = quill?.getText();
		if (str !== '' && str !== '\n') {
			e.stopPropagation();
		}
	}

	function syncToolbar() {
		const toolbar = container?.querySelector<HTMLDivElement>('.ql-toolbar');

		if (toolbar) {
			toolbar.style.display = edit ? 'inherit' : 'none';
		}
	}

	beforeUpdate(() => {
		if (edit !== prevEdit) {
			prevEdit = edit;
			syncToolbar();
		}
	});

	onMount(() => {
		import('quill').then(({ default: Quill }) => {
			quill = new Quill(element, {
				modules: {
					syntax: true,
					toolbar: toolbarOptions
				},
				theme: 'snow',
				placeholder: 'Write...'
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

			syncToolbar();
		});

		window.addEventListener('click', onWindowClick);

		return () => {
			window.removeEventListener('click', onWindowClick);
		};
	});
</script>

<div bind:this={container} on:click|stopPropagation={() => (edit = true)}>
	<div bind:this={element} on:keydown|capture={onKeyDown} />
</div>
