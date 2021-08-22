<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			organizationId = parseInt(input.page.params.organizationId);

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
	import { getQuestions, organizationQuestions } from '$lib/state/organizationQuestions';
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';
	import Questions from '$lib/UserOrganizations/Questions/Questions.svelte';

	export let organizationId: number;

	$: questions = Object.values($organizationQuestions.byOrganizationId[organizationId] || {});

	if (browser) {
		getQuestions(organizationId);
	}
</script>

<svelte:head>
	<title>Questions</title>
</svelte:head>

<OrganizationLayout {organizationId}>
	<Questions {organizationId} {questions} />
</OrganizationLayout>
