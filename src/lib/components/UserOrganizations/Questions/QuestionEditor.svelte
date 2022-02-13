<script lang="ts">
	import type {
		QuestionFlashCardPrivate,
		QuestionInputPrivate,
		QuestionMultipleChoicePrivate,
		QuestionMarkAsReadPrivate,
		QuestionPrivate
	} from '$lib/api/quantu-app-api';
	import Tags from '$lib/components/Tags.svelte';
	import FlashCardEditor from './FlashCardEditor.svelte';
	import InputEditor from './InputEditor.svelte';
	import MultipleChoiceEditor from './MultipleChoiceEditor.svelte';
	import MarkAsReadEditor from './MarkAsReadEditor.svelte';

	export let question: Partial<QuestionPrivate>;
	export let disabled = false;

	$: promptFlashCard = question.prompt as QuestionFlashCardPrivate;
	$: promptMultipleChoice = question.prompt as QuestionMultipleChoicePrivate;
	$: promptInput = question.prompt as QuestionInputPrivate;
	$: promptMarkAsRead = question.prompt as QuestionMarkAsReadPrivate;

	function onIsChallengeChange() {
		question.isChallenge = !question.isChallenge;
	}
</script>

<div class="row">
	<div class="col-md">
		<label for="question-name" class="form-label">Question Name</label>
		<input
			id="question-name"
			type="text"
			class="form-control"
			placeholder="Question Name"
			{disabled}
			bind:value={question.name}
		/>
	</div>
	<div class="col-md">
		<label for="question-type" class="form-label">Question Type</label>
		<select
			id="question-type"
			class="form-select"
			bind:value={question.type}
			aria-label="Question Type"
		>
			<option value="multiple_choice">Multiple Choice</option>
			<option value="input">Input</option>
			<option value="mark_as_read">Mark as Read</option>
			<option value="flash_card">Flash Card</option>
		</select>
	</div>
</div>
<div class="row mt-4">
	<div class="col-md">
		<label for="question-tags" class="form-label">Question Tags</label>
		<Tags id="question-tags" {disabled} bind:tags={question.tags} />
	</div>
	<div class="col-md">
		<div class="form-check">
			<input
				class="form-check-input"
				type="checkbox"
				id="question-is-challenge"
				aria-label="Question is Challenge"
				on:change={onIsChallengeChange}
			/>
			<label class="form-check-label" for="question-is-challenge">Is Challenge?</label>
		</div>
	</div>
</div>

{#if question.type === 'flash_card'}
	<FlashCardEditor {disabled} bind:prompt={promptFlashCard} />
{:else if question.type === 'multiple_choice'}
	<MultipleChoiceEditor {disabled} bind:prompt={promptMultipleChoice} />
{:else if question.type === 'input'}
	<InputEditor {disabled} bind:prompt={promptInput} />
{:else if question.type === 'mark_as_read'}
	<MarkAsReadEditor {disabled} bind:prompt={promptMarkAsRead} />
{/if}
