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
	import RichViewer from '$lib/RichViewer.svelte';
	import type Quill from 'quill';
	import type Delta from 'quill-delta';
	import type Op from 'quill-delta/dist/Op';

	export let prompt: QuestionMultipleChoicePrivate;
	export let disabled = false;

	$: choices = Object.entries(prompt.choices || {});
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
			const choices = prompt.choices || {};
			delete choices[key];
			prompt.choices = choices;
		};
	};

	$: onCreateChoice = () => {
		const choices = prompt.choices || {};
		choices[randomString()] = {
			correct: false,
			content: []
		};
		prompt.choices = choices;
	};
</script>

<div class="mt-4">
	<label for="question" class="form-label">Question</label>
	{#if disabled}
		<RichViewer content={prompt.question} />
	{:else}
		<RichEditor
			onQuill={createOnQuill('question', () => prompt.question)}
			on:textchange={createOnQuillChange('question', questionSetter)}
		/>
	{/if}
</div>

<div>
	<label for="explanation" class="form-label">Explanation</label>
	{#if disabled}
		<RichViewer content={prompt.explanation} />
	{:else}
		<RichEditor
			onQuill={createOnQuill('explanation', () => prompt.explanation)}
			on:textchange={createOnQuillChange('explanation', explanationSetter)}
		/>
	{/if}
</div>

<ul class="list-group list-group-flush">
	{#each choices as [key, choice] (key)}
		<li class="list-group-item px-0 pt-1">
			<div class="d-flex">
				<div class="form-check">
					<input
						class="form-check-input"
						type="checkbox"
						value=""
						checked={!!choice.correct}
						id={`correct-${key}`}
						{disabled}
						on:change={createChoiceCorrectSetter(choice)}
					/>
					<label class="form-check-label" for={`correct-${key}`}> Correct? </label>
				</div>
				{#if !disabled}
					<button class="ms-auto btn btn-sm btn-danger" on:click={createOnDelete(key)}
						><i class="bi bi-x" /></button
					>
				{/if}
			</div>
			{#if disabled}
				<RichViewer content={choice.content} />
			{:else}
				<RichEditor
					onQuill={createOnQuill(key, createChoiceGetter(choice))}
					on:textchange={createOnQuillChange(key, createChoiceSetter(choice))}
				/>
			{/if}
		</li>
	{/each}
</ul>

{#if !disabled}
	<div class="d-flex justify-content-center mt-2">
		<button
			type="button"
			class="btn btn-primary"
			on:click={onCreateChoice}
			aria-label="Create Question">Create Choice</button
		>
	</div>
{/if}
