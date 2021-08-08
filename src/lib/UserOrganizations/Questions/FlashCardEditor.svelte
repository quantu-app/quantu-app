<script lang="ts">
	import type { QuestionFlashCard } from '$lib/api/quantu-app-api';
	import RichEditor from '$lib/RichEditor.svelte';
	import type Quill from 'quill';
	import type Delta from 'quill-delta';
	import { beforeUpdate } from 'svelte';

	export let prompt: QuestionFlashCard;

	let prevPrompt: QuestionFlashCard;
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
		frontQuill.setContents({ ops: prompt.front } as Delta);
	}
	function onBackQuill(quill: Quill) {
		backQuill = quill;
		backQuill.setContents({ ops: prompt.back } as Delta);
	}

	beforeUpdate(() => {
		if (prompt !== prevPrompt) {
			prevPrompt = prompt;
			frontQuill?.setContents({ ops: prompt.front } as Delta);
			backQuill?.setContents({ ops: prompt.back } as Delta);
		}
	});
</script>

<label for="front" class="form-label">Front</label>
<div id="front" class="form-control">
	<RichEditor onQuill={onFrontQuill} on:textchange={onFrontChange} />
</div>

<hr />

<label for="back" class="form-label">Back</label>
<div id="back" class="form-control">
	<RichEditor onQuill={onBackQuill} on:textchange={onBackChange} />
</div>
