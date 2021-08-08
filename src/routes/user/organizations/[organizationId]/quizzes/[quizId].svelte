<script lang="ts" context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({
		page: {
			params: { organizationId, quizId }
		}
	}) {
		return {
			props: {
				organizationId,
				quizId
			}
		};
	}
</script>

<script lang="ts">
	import { getQuestions, organizationQuestions } from '$lib/state/organizationQuestions';
	import { getQuiz, organizationQuizzes } from '$lib/state/organizationQuizzes';
	import { currentUser } from '$lib/state/user';
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';
	import Quiz from '$lib/UserOrganizations/Quizzes/Quiz.svelte';

	export let organizationId: number;
	export let quizId: number;

	let prevOrganizationId: number;
	let prevQuizId: number;

	$: quiz = $organizationQuizzes.byId[quizId];
	$: questions = Object.values($organizationQuestions.byQuizId[quizId] || {});

	$: if ($currentUser && (prevQuizId !== quizId || prevOrganizationId !== organizationId)) {
		prevQuizId = quizId;
		prevOrganizationId = organizationId;
		getQuiz(organizationId, quizId);
		getQuestions(organizationId, quizId);
	}
</script>

<svelte:head>
	<title>Quiz</title>
</svelte:head>

<OrganizationLayout {organizationId}>
	{#if quiz}
		<Quiz {organizationId} {quiz} {questions} />
	{/if}
</OrganizationLayout>
