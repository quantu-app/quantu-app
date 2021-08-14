<script lang="ts">
	import type { Question } from '$lib/api/quantu-app-api';
	import Tags from '$lib/Tags.svelte';
	import FlashCardEditor from './FlashCardEditor.svelte';
	import MultipleChoiceEditor from './MultipleChoiceEditor.svelte';

	export let question: Partial<Question>;
</script>

<div class="row">
	<div class="col">
		<label for="question-name" class="form-label">Question Name</label>
		<input
			id="question-name"
			type="text"
			class="form-control"
			placeholder="Question Name"
			bind:value={question.name}
		/>
	</div>
	<div class="col">
		<label for="question-type" class="form-label">Question Type</label>
		<select
			id="question-type"
			class="form-select"
			bind:value={question.type}
			aria-label="Question Type"
		>
			<option value="multiple_choice">Multiple Choice</option>
			<option value="flash_card">Flash Card</option>
		</select>
	</div>
</div>
<div class="mt-2">
	<label for="question-tags" class="form-label">Question Tags</label>
	<Tags id="question-tags" bind:tags={question.tags} />
</div>

{#if question.type === 'flash_card'}
	<FlashCardEditor bind:prompt={question.prompt} />
{:else if question.type === 'multiple_choice'}
	<MultipleChoiceEditor bind:prompt={question.prompt} />
{/if}
