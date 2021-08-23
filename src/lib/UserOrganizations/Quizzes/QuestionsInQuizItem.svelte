<script lang="ts">
	import type { QuestionPrivate } from '$lib/api/quantu-app-api';
	import { titleCase } from 'title-case';

	export let question: QuestionPrivate;
	export let onClick: (question: QuestionPrivate) => void;

	$: internalOnClick = () => onClick(question);
</script>

<div class="d-flex w-100 justify-content-between">
	<h4>
		<button type="button" class="btn btn-primary" on:click={internalOnClick}><slot /></button>
		<button
			type="button"
			class="btn btn-link"
			data-bs-toggle="modal"
			data-bs-target="#update-question">{question.name || 'No Name'}</button
		>
		<h6 class="d-inline">- {titleCase(question.type.replace('_', ' '))}</h6>
	</h4>
	<button
		type="button"
		class="btn btn-primary"
		data-bs-toggle="modal"
		data-bs-target="#view-question">View</button
	>
</div>
