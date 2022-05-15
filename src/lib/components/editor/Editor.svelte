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
	import { Slate, Editable, withSvelte, isHotkey, isReadOnly } from 'svelte-slate';
	import { Editor, type Selection } from 'slate';
	import { createEditor } from 'slate';
	import { withHistory } from 'slate-history';
	import { toggleMark } from './utils';
	import type { IElement } from './Element.svelte';
	import Element from './Element.svelte';
	import type { IText } from './Leaf.svelte';
	import Leaf from './Leaf.svelte';
	import HoveringToolbar from './HoveringToolbar.svelte';
	import Toolbar from './Toolbar.svelte';
	import { withImages } from './ImageElement.svelte';
	import { longpress } from './longpress';
	import { withLatex } from './LatexElement.svelte';
	import { isCodeElement } from './CodeElement.svelte';

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
	export let hoveringToolbar = true;

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
		if (!isReadOnly(editor)) {
			const [match] = Array.from(
				Editor.nodes(editor, {
					at: Editor.unhangRange(editor, editor.selection),
					match: isCodeElement
				})
			);
			if (!match) {
				open = true;
			}
		}
	}
</script>

<Slate bind:editor bind:selection bind:value>
	{#if hoveringToolbar}
		<HoveringToolbar container={ref} bind:open />
	{:else}
		<Toolbar />
	{/if}
	<div use:longpress on:longpress={onLongPress} class:editor-with-helper={!hoveringToolbar}>
		<Editable bind:ref {readOnly} {Element} {Leaf} {onKeyDown} {placeholder} />
	</div>
</Slate>
