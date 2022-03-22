<svelte:options immutable={true} />

<script lang="ts" context="module">
	const HOTKEYS = {
		'mod+b': 'bold',
		'mod+i': 'italic',
		'mod+u': 'underline',
		'mod+`': 'code'
	};
</script>

<script lang="ts">
	import { Slate, Editable, withSvelte, isHotkey } from 'svelte-slate';
	import type { Selection } from 'slate';
	import { createEditor } from 'slate';
	import { withHistory } from 'slate-history';
	import { toggleMark } from './utils';
	import type { IElement } from './Element.svelte';
	import Element from './Element.svelte';
	import type { IText } from './Leaf.svelte';
	import Leaf from './Leaf.svelte';
	import HoveringToolbar from './HoveringToolbar.svelte';
	import { withImages } from './ImageElement.svelte';
	import { longpress } from './longpress';
	import { withLatex } from './LatexElement.svelte';

	export let value: Array<IText | IElement> = [
		{
			type: 'paragraph',
			children: [{ text: '' }]
		}
	];
	export let selection: Selection | null = null;
	export let readOnly = false;
	export let placeholder = 'Type...';
	export let editor = withHistory(withLatex(withImages(withSvelte(createEditor()))));

	let open = false;
	let ref: HTMLDivElement;

	function onKeyDown(event: KeyboardEvent) {
		for (const hotkey in HOTKEYS) {
			if (isHotkey(hotkey, event)) {
				event.preventDefault();
				const mark = HOTKEYS[hotkey];
				toggleMark(editor, mark);
			}
		}
	}

	function onLongPress() {
		open = true;
	}
</script>

<Slate bind:editor bind:selection bind:value>
	<HoveringToolbar container={ref} bind:open />
	<div use:longpress on:longpress={onLongPress}>
		<Editable bind:ref {readOnly} {Element} {Leaf} {onKeyDown} {placeholder} />
	</div>
</Slate>
