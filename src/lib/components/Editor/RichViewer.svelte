<svelte:options immutable={true} />

<script lang="ts">
	import type { IElement } from './Element.svelte';
	import type { IText } from './Leaf.svelte';
	import Editor from './Editor.svelte';

	export let id: string = undefined;
	export let value: Array<IText | IElement>;

	$: if (!value || value.length === 0) {
		value = [{ type: 'paragraph', children: [{ text: '' }] }];
	}
</script>

<div {id} class="p-2">
	<Editor bind:value readOnly={true} placeholder={''} />
</div>
