<script lang="ts" context="module">
	function randomString() {
		return Math.random().toString(36).substr(2);
	}
	function createChoiceSetter(choice: { content: Op[] }) {
		return function setter(ops: Op[]) {
			choice.content = ops;
		};
	}
	function createChoiceCorrectSetter(choice: { correct?: boolean }) {
		return function setter(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
			choice.correct = !!e.currentTarget.checked;
		};
	}
	function createChoiceGetter(choice: { content: Op[] }) {
		return function getter() {
			return choice.content;
		};
	}
</script>

<script lang="ts">
	import type { QuestionMultipleChoicePrivate } from '$lib/api/quantu-app-api';
	import RichEditor from '$lib/RichEditor.svelte';
	import type Quill from 'quill';
	import type Delta from 'quill-delta';
	import type Op from 'quill-delta/dist/Op';

	export let prompt: QuestionMultipleChoicePrivate;

	let quillEditors: { [key: string]: Quill } = {};

	$: createOnQuill = (key: string, getter: () => Op[]) => {
		return function onQuill(quill: Quill) {
			quillEditors[key] = quill;
			quill.setContents({ ops: getter() } as Delta, 'api');
		};
	};

	$: createOnQuillChange = (key: string, setter: (ops: Op[]) => void) => {
		return function onChange() {
			const quill = quillEditors[key];

			if (quill) {
				setter(quill.getContents().ops);
			}
		};
	};

	$: questionSetter = (ops: Op[]) => {
		prompt.question = ops;
	};
	$: explanationSetter = (ops: Op[]) => {
		prompt.explanation = ops;
	};

	$: createOnDelete = (key: string) => {
		return function onDelete() {
			const choices = prompt.choices;
			delete choices[key];
			prompt.choices = choices;
		};
	};

	$: onCreateChoice = () => {
		prompt.choices[randomString()] = {
			correct: false,
			content: []
		};
	};
</script>

<div class="mt-4">
	<label for="question" class="form-label">Question</label>
	<RichEditor
		onQuill={createOnQuill('question', () => prompt.question)}
		on:textchange={createOnQuillChange('question', questionSetter)}
	/>
</div>

<div>
	<label for="explanation" class="form-label">Explanation</label>
	<RichEditor
		onQuill={createOnQuill('explanation', () => prompt.explanation)}
		on:textchange={createOnQuillChange('explanation', explanationSetter)}
	/>
</div>

<ul class="list-group list-group-flush">
	{#each Object.entries(prompt.choices) as [key, choice], index}
		<li class="list-group-item ">
			<div class="d-flex">
				<span class="badge bg-primary py-2 px-3"> {(index + 10).toString(36).toUpperCase()} </span>
				<div class="form-check ms-4">
					<input
						class="form-check-input"
						type="checkbox"
						value=""
						checked={!!choice.correct}
						id={`correct-${key}`}
						on:change={createChoiceCorrectSetter(choice)}
					/>
					<label class="form-check-label" for={`correct-${key}`}> Correct? </label>
				</div>
				<button class="ms-auto btn btn-sm btn-danger" on:click={createOnDelete(key)}
					><i class="bi bi-x" /></button
				>
			</div>
			<RichEditor
				onQuill={createOnQuill(key, createChoiceGetter(choice))}
				on:textchange={createOnQuillChange(key, createChoiceSetter(choice))}
			/>
		</li>
	{/each}
</ul>

<div class="d-flex justify-content-center mt-2">
	<button
		type="button"
		class="btn btn-primary"
		on:click={onCreateChoice}
		aria-label="Create Question">Create Choice</button
	>
</div>
