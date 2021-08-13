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
	import { getQuizzes, organizationQuizzes } from '$lib/state/organizationQuizzes';
	import { currentUser } from '$lib/state/user';
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';
	import Quizzes from '$lib/UserOrganizations/Quizzes/Quizzes.svelte';

	export let organizationId: number;
	let prevOrganizationId: number;

	$: quizzes = Object.values($organizationQuizzes.byOrganizationId[organizationId] || {});

	$: if ($currentUser && organizationId !== prevOrganizationId) {
		prevOrganizationId = organizationId;
		getQuizzes(organizationId);
	}
</script>

<svelte:head>
	<title>Quizzes</title>
</svelte:head>

<OrganizationLayout {organizationId}>
	<Quizzes {organizationId} {quizzes} />
</OrganizationLayout>
