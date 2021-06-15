<script context="module" lang="ts">
	const toolbarOptions = [
		[
			{
				header: [1, 2, 3, false]
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
				direction: 'rtl'
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
	import { onMount, createEventDispatcher } from 'svelte';

	export let multiline = true;
	export let toolbar = true;
	export let onQuill: ((quill: Quill) => void) | undefined;

	let quill: Quill;
	let element: HTMLDivElement;

	const dispatch = createEventDispatcher<{
		textchange: [delta: Delta, oldContents: Delta, source: Sources];
		selectionchange: [
			range: { index: Number; length: Number },
			oldRange: { index: Number; length: Number },
			source: String
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

	onMount(async () => {
		const { default: Quill } = await import('quill');

		quill = new Quill(element, {
			modules: {
				toolbar: toolbar ? toolbarOptions : false,
				autoformat: true
			},
			theme: 'snow',
			placeholder: 'Write something...'
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
					range: { index: Number; length: Number },
					oldRange: { index: Number; length: Number },
					source: String
				]
			);
		}

		quill.on('text-change', onTextChange);
		quill.on('selection-change', onSelectionChange);

		onQuill && onQuill(quill);
	});
</script>

<div>
	<div bind:this={element} on:keydown|capture={onKeyDown} />
</div>
