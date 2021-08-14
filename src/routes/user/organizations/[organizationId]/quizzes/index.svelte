<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';

	export async function load(input: LoadInput) {
		const response = await authGuard(input),
			organizationId = parseInt(input.page.params.organizationId);

		if (response.status !== 302) {
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
</script>

<svelte:head>
	<title>Quizzes</title>
</svelte:head>

<OrganizationLayout {organizationId}>
	<Quizzes {organizationId} {quizzes} />
</OrganizationLayout>
