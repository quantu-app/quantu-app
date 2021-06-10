<script lang="ts">
	import QuillEditor from '$lib/QuillEditor.svelte';
	import { beforeUpdate, createEventDispatcher, onMount } from 'svelte';
	import type Delta from 'quill-delta';
	import type { Text } from 'automerge';
	import { addEventListener, removeEventListener } from '$lib/utils';

	export let text: Text;

	const dispatch = createEventDispatcher<{ textchange: Delta }>();

	let textString = text.toString();

	let edit: boolean;
	let prevEdit: boolean;

	function onTextChange(event: CustomEvent<Delta>) {
		dispatch('textchange', event.detail);
	}

	function onWindowClick() {
		edit = false;
	}

	beforeUpdate(() => {
		if (edit !== prevEdit) {
			prevEdit = edit;
			textString = text.toString();
		}
	});

	onMount(() => {
		addEventListener('click', onWindowClick);

		return () => {
			removeEventListener('click', onWindowClick);
		};
	});
</script>

<div on:click|stopPropagation={() => (edit = true)}>
	{#if edit}
		<QuillEditor text={textString} multiline={false} on:textchange={onTextChange} />
	{:else if text.length > 0}
		{text.toString()}
	{:else}
		Click to Edit
	{/if}
</div>
