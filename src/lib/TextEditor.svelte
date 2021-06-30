<script lang="ts">
	import QuillEditor from '$lib/QuillEditor.svelte';
	import { createEventDispatcher } from 'svelte';
	import type Delta from 'quill-delta';
	import type { Text } from 'automerge';
	import type { Quill, Sources } from 'quill';
	import ClickAway from '$lib/ClickAway.svelte';

	export let text: Text;

	const dispatch = createEventDispatcher<{
		textchange: Delta;
	}>();

	let edit: boolean;

	function onTextChange({
		detail: [delta, _oldContents, source]
	}: CustomEvent<[delta: Delta, oldContents: Delta, source: Sources]>) {
		if (source === 'user') {
			dispatch('textchange', delta);
		}
	}

	function onQuill(quill: Quill) {
		quill.setText(text.toString());
	}
</script>

<ClickAway on:click={() => (edit = true)} on:clickaway={() => (edit = false)}>
	{#if edit}
		<QuillEditor multiline={false} on:textchange={onTextChange} {onQuill} />
	{:else if text.toString().trim().length > 0}
		{text.toString()}
	{:else}
		Write...
	{/if}
</ClickAway>
