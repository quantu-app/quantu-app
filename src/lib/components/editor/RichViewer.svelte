<svelte:options immutable={true} />

<script lang="ts">
	import Editor from './Editor.svelte';

	export let id: string = undefined;
	export let value: any[];
	export let placeholder = '';

	$: if (!value || value.length === 0) {
		value = [{ type: 'paragraph', children: [{ text: '' }] }];
	}
</script>

<div {id}>
	<Editor bind:value readOnly={true} {placeholder} />
</div>
