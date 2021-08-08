<script lang="ts">
	import type { Question } from '$lib/api/quantu-app-api';
	import QuestionList from './QuestionList.svelte';
	import CreateQuestion from './CreateQuestion.svelte';

	export let organizationId: number;
	export let questions: Question[];
</script>

<div class="container-md">
	<CreateQuestion quizId={null} {organizationId} />
</div>

<div class="container-md">
	<QuestionList {organizationId} {questions} />
</div>
