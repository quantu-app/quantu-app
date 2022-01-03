<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			organizationId = parseInt(input.params.organizationId);

		if (!browser && isValidStatus(response)) {
			await Promise.all([getQuizzes(organizationId), getOrganization(organizationId)]);
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
	import { getOrganization, userOrganizations } from '$lib/state/userOrganizations';
	import { setOrganizationIdAssets } from '$lib/state/selectedAssets';

	export let organizationId: number;

	$: organization = $userOrganizations.byId[organizationId];
	$: quizzes = Object.values($organizationQuizzes.byOrganizationId[organizationId] || {});

	if (browser) {
		getOrganization(organizationId);
		getQuizzes(organizationId, undefined, true);
		setOrganizationIdAssets(organizationId);
	}
</script>

<svelte:head>
	<title>Quizzes</title>
</svelte:head>

<OrganizationLayout
	{organizationId}
	breadcrumbs={[
		{ href: '/', title: 'Home' },
		{
			href: `/user/organizations`,
			title: 'My Organizations'
		},
		{
			href: `/user/organizations/${organizationId}`,
			title: organization?.name || 'Organization'
		},
		{
			href: `/user/organizations/${organizationId}/quizzes`,
			title: 'Quizzes'
		}
	]}
>
	<Quizzes {organizationId} {quizzes} />
</OrganizationLayout>
