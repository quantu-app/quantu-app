<svelte:options immutable={true} />

<script lang="ts">
	import type { BaseEditor, Selection } from 'slate';
	import type { ISvelteEditor } from 'svelte-slate';
	import Editor from './Editor.svelte';
	import type { HistoryEditor } from 'slate-history';

	export let id: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let value: any;
	export let selection: Selection | null = null;
	export let placeholder = 'Type...';
	export let editor: (BaseEditor & ISvelteEditor & HistoryEditor) | undefined = undefined;
	export let showHelper = false;
	export let onChange: (name?: string) => void = () => undefined;

	$: if (!value || value.length === 0) {
		value = [{ type: 'paragraph', children: [{ text: '' }] }];
	}
	function onChangeInternal() {
		onChange(name);
	}
</script>

<div {id} {name} class="border p-2">
	<Editor
		bind:value
		bind:editor
		bind:selection
		readOnly={false}
		{placeholder}
		hoveringToolbar={!showHelper}
		onChange={onChangeInternal}
	/>
</div>
