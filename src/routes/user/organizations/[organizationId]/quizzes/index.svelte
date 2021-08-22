<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			organizationId = parseInt(input.page.params.organizationId);

		if (!browser && isValidStatus(response)) {
			await getQuizzes(organizationId);
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
	import { getQuizzes, organizationQuizzes } from '$lib/state/organizationQuizzes';
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';
	import Quizzes from '$lib/UserOrganizations/Quizzes/Quizzes.svelte';

	export let organizationId: number;

	$: quizzes = Object.values($organizationQuizzes.byOrganizationId[organizationId] || {});

	if (browser) {
		getQuizzes(organizationId);
	}
</script>

<svelte:head>
	<title>Quizzes</title>
</svelte:head>

<OrganizationLayout {organizationId}>
	<Quizzes {organizationId} {quizzes} />
</OrganizationLayout>
