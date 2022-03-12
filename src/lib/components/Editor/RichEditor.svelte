<svelte:options immutable={true} />

<script lang="ts">
	import type { Selection } from 'slate';
	import type { IElement } from './Element.svelte';
	import type { IText } from './Leaf.svelte';
	import Editor from './Editor.svelte';

	export let id: string = undefined;
	export let value: Array<IText | IElement>;
	export let selection: Selection | null = null;
	export let placeholder = 'Type...';

	$: if (!value || value.length === 0) {
		value = [{ type: 'paragraph', children: [{ text: '' }] }];
	}
</script>

<div {id} class="border p-2">
	<Editor bind:value bind:selection readOnly={false} {placeholder} />
</div>
