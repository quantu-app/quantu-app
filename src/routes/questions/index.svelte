<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			organizationIdString = input.page.query.get('organizationId'),
			organizationId = organizationIdString && parseInt(organizationIdString, 10);

		if (!browser && isValidStatus(response)) {
			await getQuestions(organizationId);
		}

		return {
			...response,
			props: {
				organizationId
			}
		};
	}
</script>

<script lang="ts">
	import { getQuestions, questions } from '$lib/state/questions';
	import AppLayout from '$lib/AppLayout.svelte';
	import Questions from '$lib/Questions/Questions.svelte';

	export let organizationId: number;

	$: questionList = Object.values(
		(organizationId ? $questions.byOrganizationId[organizationId] : $questions.byId) || {}
	);

	if (browser) {
		getQuestions(organizationId);
	}
</script>

<svelte:head>
	<title>Questions</title>
</svelte:head>

<AppLayout>
	<Questions questions={questionList} />
</AppLayout>
