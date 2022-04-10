<svelte:options immutable={true} />

<script lang="ts">
	import type { BaseEditor, Selection } from 'slate';
	import type { ISvelteEditor } from 'svelte-slate';
	import type { IElement } from './Element.svelte';
	import type { IText } from './Leaf.svelte';
	import Editor from './Editor.svelte';
	import type { HistoryEditor } from 'slate-history';

	export let id: string = undefined;
	export let value: Array<IText | IElement>;
	export let selection: Selection | null = null;
	export let placeholder = 'Type...';
	export let editor: ISvelteEditor | BaseEditor | HistoryEditor = undefined;

	$: if (!value || value.length === 0) {
		value = [{ type: 'paragraph', children: [{ text: '' }] }];
	}
	$: console.log(value);
</script>

<div {id} class="border p-2">
	<Editor bind:value bind:editor bind:selection readOnly={false} {placeholder} />
</div>
