<script lang="ts" context="module">
	function randomStringNotInArray<K extends string, T extends Record<K, string>>(
		array: T[],
		key: K
	) {
		const group = groupBy(array, key);
		const keys = Object.keys(group);
		let value = randomString();
		while (keys.includes(value)) {
			value = randomString();
		}
		return value;
	}
	function createChoiceCorrectSetter(choice: { correct?: boolean }) {
		return function setter(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
			choice.correct = !!e.currentTarget.checked;
		};
	}
</script>

<script lang="ts">
	import RichEditor from '$lib/components/Editor/RichEditor.svelte';
	import RichViewer from '$lib/components/Editor/RichViewer.svelte';
	import { groupBy, randomString } from '$lib/utils';
	import type { MultipleChoicePrivate } from '$lib/types';

	export let prompt: MultipleChoicePrivate;
	export let disabled = false;

	$: choices = prompt.choices || [];

	$: createOnDelete = (id: string) => {
		return function onDelete() {
			const choices = prompt.choices || [];
			const index = choices.findIndex((choice) => choice.id === id);
			if (index !== -1) {
				choices.splice(index, 1);
				prompt.choices = choices;
			}
		};
	};

	$: onCreateChoice = () => {
		const choices = prompt.choices || [];
		choices.push({
			id: randomStringNotInArray(choices, 'id'),
			correct: false,
			content: []
		});
		prompt.choices = choices;
	};
</script>

<div class="mt-4">
	<label for="question" class="form-label">Question</label>
	{#if disabled}
		<RichViewer value={prompt.question} />
	{:else}
		<RichEditor bind:value={prompt.question} />
	{/if}
</div>

<div>
	<label for="explanation" class="form-label">Explanation</label>
	{#if disabled}
		<RichViewer value={prompt.explanation} />
	{:else}
		<RichEditor bind:value={prompt.explanation} />
	{/if}
</div>

<div class="my-4">
	<label for="single-answer" class="form-label">Can the user select only one answer?</label>
	<input
		class="form-check-input"
		type="checkbox"
		bind:checked={prompt.singleAnswer}
		id="flexCheckDefault"
	/>
</div>

<ul class="list-group list-group-flush">
	{#each choices as choice (choice.id)}
		<li class="list-group-item px-0 pt-1">
			<div class="d-flex">
				<div class="form-check">
					<input
						class="form-check-input"
						type="checkbox"
						value=""
						checked={!!choice.correct}
						id={`correct-${choice.id}`}
						{disabled}
						on:change={createChoiceCorrectSetter(choice)}
					/>
					<label class="form-check-label" for={`correct-${choice.id}`}>Correct?</label>
				</div>
				{#if !disabled}
					<button class="ms-auto btn btn-sm btn-danger" on:click={createOnDelete(choice.id)}
						><i class="bi bi-x" /></button
					>
				{/if}
			</div>
			{#if disabled}
				<RichViewer value={choice.content} />
			{:else}
				<RichEditor bind:value={choice.content} />
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
			aria-label="Create Challenge">Create Choice</button
		>
	</div>
{/if}
