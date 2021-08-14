<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';

	export async function load(input: LoadInput) {
		const response = await authGuard(input),
			organizationId = parseInt(input.page.params.organizationId);

		if (response.status !== 302) {
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
</script>

<svelte:head>
	<title>Questions</title>
</svelte:head>

<OrganizationLayout {organizationId}>
	<Questions {organizationId} {questions} />
</OrganizationLayout>
