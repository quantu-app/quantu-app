<script lang="ts">
	import QuillEditor from '$lib/QuillEditor.svelte';
	import { beforeUpdate, createEventDispatcher, onMount } from 'svelte';
	import type Delta from 'quill-delta';
	import type { Text } from 'automerge';
	import type { Quill, Sources } from 'quill';

	export let text: Text;

	const dispatch = createEventDispatcher<{
		textchange: Delta;
	}>();

	let edit: boolean;
	let prevEdit: boolean;

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

	function onWindowClick() {
		edit = false;
	}

	beforeUpdate(() => {
		if (edit !== prevEdit) {
			prevEdit = edit;
		}
	});

	onMount(() => {
		window.addEventListener('click', onWindowClick);

		return () => {
			window.removeEventListener('click', onWindowClick);
		};
	});
</script>

<div on:click|stopPropagation={() => (edit = true)}>
	{#if edit}
		<QuillEditor multiline={false} on:textchange={onTextChange} {onQuill} />
	{:else if text.toString().trim().length > 0}
		{text.toString()}
	{:else}
		Write...
	{/if}
</div>
