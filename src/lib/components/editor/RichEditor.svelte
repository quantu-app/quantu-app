<svelte:options immutable={true} />

<script lang="ts">
	import type { BaseEditor, Selection } from 'slate';
	import type { ISvelteEditor } from 'svelte-slate';
	import Editor from './Editor.svelte';
	import type { HistoryEditor } from 'slate-history';

	export let id: string | undefined = undefined;
	export let value: any;
	export let selection: Selection | null = null;
	export let placeholder = 'Type...';
	export let editor: ISvelteEditor | BaseEditor | HistoryEditor | undefined = undefined;
	export let showHelper = false;

	$: if (!value || value.length === 0) {
		value = [{ type: 'paragraph', children: [{ text: '' }] }];
	}
</script>

<div {id} class="border p-2">
	<Editor
		bind:value
		bind:editor
		bind:selection
		readOnly={false}
		{placeholder}
		hoveringToolbar={!showHelper}
	/>
</div>
