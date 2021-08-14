<script lang="ts">
	import type { QuestionFlashCardPrivate } from '$lib/api/quantu-app-api';
	import RichEditor from '$lib/RichEditor.svelte';
	import type Quill from 'quill';
	import type Delta from 'quill-delta';
	import { beforeUpdate } from 'svelte';

	export let prompt: QuestionFlashCardPrivate;

	let prevPrompt: QuestionFlashCardPrivate;
	let frontQuill: Quill;
	let backQuill: Quill;

	function onFrontChange() {
		if (frontQuill) {
			prompt.front = frontQuill.getContents().ops;
		}
	}
	function onBackChange() {
		if (backQuill) {
			prompt.back = backQuill.getContents().ops;
		}
	}

	function onFrontQuill(quill: Quill) {
		frontQuill = quill;
		frontQuill.setContents({ ops: prompt.front } as Delta, 'api');
	}
	function onBackQuill(quill: Quill) {
		backQuill = quill;
		backQuill.setContents({ ops: prompt.back } as Delta, 'api');
	}

	beforeUpdate(() => {
		if (prompt !== prevPrompt) {
			prevPrompt = prompt;
			frontQuill?.setContents({ ops: prompt.front } as Delta, 'api');
			backQuill?.setContents({ ops: prompt.back } as Delta, 'api');
		}
	});
</script>

<div class="mt-4">
	<label for="front" class="form-label">Front</label>
	<RichEditor onQuill={onFrontQuill} on:textchange={onFrontChange} />
</div>

<hr />

<div>
	<label for="back" class="form-label">Back</label>
	<RichEditor onQuill={onBackQuill} on:textchange={onBackChange} />
</div>
