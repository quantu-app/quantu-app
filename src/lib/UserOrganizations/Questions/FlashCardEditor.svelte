<script lang="ts">
	import type { QuestionFlashCardPrivate } from '$lib/api/quantu-app-api';
	import RichEditor from '$lib/RichEditor.svelte';
	import RichViewer from '$lib/RichViewer.svelte';
	import type Quill from 'quill';
	import type Delta from 'quill-delta';

	export let prompt: QuestionFlashCardPrivate;
	export let disabled = false;

	let prevPrompt: QuestionFlashCardPrivate;
	let frontQuill: Quill;
	let backQuill: Quill;

	$: onFrontChange = () => {
		if (frontQuill) {
			prompt.front = frontQuill.getContents().ops;
		}
	};
	$: onBackChange = () => {
		if (backQuill) {
			prompt.back = backQuill.getContents().ops;
		}
	};

	function onFrontQuill(quill: Quill) {
		frontQuill = quill;
		frontQuill.setContents({ ops: prompt.front } as Delta, 'api');
	}
	function onBackQuill(quill: Quill) {
		backQuill = quill;
		backQuill.setContents({ ops: prompt.back } as Delta, 'api');
	}

	$: if (prompt !== prevPrompt) {
		prevPrompt = prompt;
		frontQuill?.setContents({ ops: prompt.front } as Delta, 'api');
		backQuill?.setContents({ ops: prompt.back } as Delta, 'api');
	}
</script>

<div class="mt-4">
	<label for="front" class="form-label">Front</label>
	{#if disabled}
		<RichViewer content={prompt.front} />
	{:else}
		<RichEditor onQuill={onFrontQuill} on:textchange={onFrontChange} />
	{/if}
</div>

<hr />

<div>
	<label for="back" class="form-label">Back</label>
	{#if disabled}
		<RichViewer content={prompt.back} />
	{:else}
		<RichEditor onQuill={onBackQuill} on:textchange={onBackChange} />
	{/if}
</div>
