<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		questionNameFilter: string | undefined;
	}

	const state = writable<IState>({
		questionNameFilter: undefined
	});
</script>

<script lang="ts">
	import type { Quiz, Question } from '$lib/api/quantu-app-api';
	import Search from '$lib/Search.svelte';
	import { debounce } from '@aicacia/debounce';
	import { updateQuiz } from '$lib/state/organizationQuizzes';
	import CreateQuestion from '$lib/UserOrganizations/Questions/CreateQuestion.svelte';
	import QuestionList from '$lib/UserOrganizations/Questions/QuestionList.svelte';
	import QuestionsInQuiz from '$lib/UserOrganizations/Quizzes/QuestionsInQuiz.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Tags from '$lib/Tags.svelte';
	import { removeQuestionsFromQuiz } from '$lib/state/organizationQuestions';

	export let organizationId: number;
	export let quiz: Quiz;
	export let questions: Question[];

	function onNameChange() {
		updateQuiz(organizationId, quiz.id, {
			name: quiz.name
		});
	}

	function onTagsChange() {
		updateQuiz(organizationId, quiz.id, {
			tags: quiz.tags
		});
	}

	function onDescriptionChange() {
		updateQuiz(organizationId, quiz.id, {
			description: quiz.description
		});
	}

	function onPublishedChange(e: Event) {
		quiz.published = !quiz.published;
		updateQuiz(organizationId, quiz.id, {
			published: quiz.published
		});
	}

	function createOnRemove(question: Question) {
		return async function onRemove() {
			await removeQuestionsFromQuiz(organizationId, quiz.id, [question.id]);
		};
	}

	const debouncedOnTagsChange = debounce(onTagsChange, 1000);

	$: filter = (question: Question) =>
		$state.questionNameFilter ? fuzzyEquals($state.questionNameFilter, question.name) : true;
</script>

<div class="container mb-2">
	<div class="row justify-content-between">
		<div class="col-md">
			<form class="row" on:submit|preventDefault>
				<div class="col-md">
					<label for="quiz-name" class="form-label">Quiz Name</label>
					<input
						id="quiz-name"
						type="text"
						class="form-control"
						placeholder="Enter Name"
						bind:value={quiz.name}
						on:change={onNameChange}
					/>
				</div>
				<div class="col-md">
					<label for="quiz-tags" class="form-label mb-0">Quiz Tags</label>
					<Tags id="quiz-tags" bind:tags={quiz.tags} on:change={debouncedOnTagsChange} />
				</div>
			</form>
		</div>
		<div class="col-md">
			<div class="d-flex mt-2 justify-content-end">
				<QuestionsInQuiz {organizationId} {quiz} />
				<div class="p-1" />
				<CreateQuestion {organizationId} quizId={quiz.id} />
				<div class="p-1" />
				<button
					type="button"
					class="btn"
					class:btn-primary={quiz.published}
					class:btn-outline-primary={!quiz.published}
					on:click={onPublishedChange}
				>
					{#if quiz.published}
						<i class="bi bi-eye" />
					{:else}
						<i class="bi bi-eye-slash" />
					{/if}
				</button>
			</div>
		</div>
	</div>
	<div class="mt-2">
		<label for="quiz-description">Description</label>
		<textarea
			class="form-control"
			placeholder="Quiz Description"
			id="quiz-description"
			bind:value={quiz.description}
			on:change={onDescriptionChange}
		/>
	</div>
</div>

<div class="container">
	<Search bind:filter={$state.questionNameFilter} />
</div>
<div class="container">
	<QuestionList {organizationId} questions={questions.filter(filter)}>
		<svelte:fragment slot="dropdown" let:question let:onUpdate let:onDelete>
			<li>
				<button
					type="button"
					class="dropdown-item justify-content-between"
					data-bs-toggle="modal"
					data-bs-target="#update-question"
					aria-label="Update"
					on:click={onUpdate}>Update</button
				>
			</li>
			<li slot="dropdown" let:question>
				<button
					type="button"
					class="dropdown-item justify-content-between"
					aria-label="Remove"
					on:click={createOnRemove(question)}>Remove</button
				>
				<button
					type="button"
					class="dropdown-item justify-content-between"
					data-bs-toggle="modal"
					data-bs-target="#delete-question"
					aria-label="Delete"
					on:click={onDelete}>Delete</button
				>
			</li>
		</svelte:fragment>
	</QuestionList>
</div>
