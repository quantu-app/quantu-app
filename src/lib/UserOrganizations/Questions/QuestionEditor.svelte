<script lang="ts">
	import type { Question } from '$lib/api/quantu-app-api';
	import FlashCardEditor from './FlashCardEditor.svelte';

	export let question: Partial<Question>;
</script>

<div class="input-group mb-2">
	<label for="question-name" class="input-group-text">Name</label>
	<input
		id="question-name"
		type="text"
		class="form-control"
		placeholder="Question Name"
		bind:value={question.name}
	/>
</div>
<div class="input-group mb-2">
	<label for="question-type" class="input-group-text">Type</label>
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

{#if question.type === 'flash_card'}
	<FlashCardEditor bind:prompt={question.prompt} />
{/if}
