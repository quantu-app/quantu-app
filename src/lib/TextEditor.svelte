<script lang="ts">
	import QuillEditor from '$lib/QuillEditor.svelte';
	import { beforeUpdate, createEventDispatcher, onDestroy, onMount } from 'svelte';
	import type Delta from 'quill-delta';
	import type { Text } from 'automerge';

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
		window.addEventListener('click', onWindowClick);
	});

	onDestroy(() => {
		window.removeEventListener('click', onWindowClick);
	});
</script>

<div on:click|stopPropagation={() => (edit = true)}>
	{#if edit}
		<QuillEditor text={textString} multiline={false} on:textchange={onTextChange} />
	{:else}
		{text.toString()}
	{/if}
</div>
