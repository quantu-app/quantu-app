<script lang="ts">
	import type { QuestionPrivate } from '$lib/api/quantu-app-api';
	import { titleCase } from 'title-case';
	import QuestionEditor from '../Questions/QuestionEditor.svelte';

	export let question: QuestionPrivate;
	export let onClick: (question: QuestionPrivate) => void;

	$: internalOnClick = () => onClick(question);
</script>

<div class="accordion-item">
	<h4 class="accordion-header" id={`question-quiz-header-${question.id}`}>
		<button
			class="accordion-button"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target={`#question-quiz-${question.id}`}
			aria-expanded="true"
			aria-controls={`question-quiz-${question.id}`}
		>
			<button type="button" class="btn btn-primary" on:click|stopPropagation={internalOnClick}
				><slot /></button
			>
			<span class="m-0 mx-4">{question.name || 'No Name'}</span>
			<h6 class="m-0 d-inline">- {titleCase(question.type.replace('_', ' '))}</h6>
		</button>
	</h4>
	<div
		id={`question-quiz-${question.id}`}
		class="accordion-collapse collapse"
		aria-labelledby={`question-quiz-header-${question.id}`}
		data-bs-parent="#question-quiz-list"
	>
		<QuestionEditor disabled {question} />
	</div>
</div>
