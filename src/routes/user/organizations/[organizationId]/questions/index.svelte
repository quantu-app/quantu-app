<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';

	export async function load(input: LoadInput) {
		const response = await authGuard(input);

		return {
			...response,
			props: {
				organizationId: parseInt(input.page.params.organizationId)
			}
		};
	}
</script>

<script lang="ts">
	import { getQuestions, organizationQuestions } from '$lib/state/organizationQuestions';
	import { currentUser } from '$lib/state/user';
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';
	import Questions from '$lib/UserOrganizations/Questions/Questions.svelte';

	export let organizationId: number;
	let prevOrganizationId: number;

	$: questions = Object.values($organizationQuestions.byOrganizationId[organizationId] || {});

	$: if ($currentUser && organizationId !== prevOrganizationId) {
		prevOrganizationId = organizationId;
		getQuestions(organizationId);
	}
</script>

<svelte:head>
	<title>Questions</title>
</svelte:head>

<OrganizationLayout {organizationId}>
	<Questions {organizationId} {questions} />
</OrganizationLayout>
