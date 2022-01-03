<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			organizationId = parseInt(input.params.organizationId);

		if (!browser && isValidStatus(response)) {
			await Promise.all([getQuestions(organizationId), getOrganization(organizationId)]);
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
	import { getOrganization, userOrganizations } from '$lib/state/userOrganizations';
	import { setOrganizationIdAssets } from '$lib/state/selectedAssets';

	export let organizationId: number;

	$: organization = $userOrganizations.byId[organizationId];
	$: questions = Object.values($organizationQuestions.byOrganizationId[organizationId] || {});

	if (browser) {
		getOrganization(organizationId);
		getQuestions(organizationId, undefined, true);
		setOrganizationIdAssets(organizationId);
	}
</script>

<svelte:head>
	<title>Questions</title>
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
			href: `/user/organizations/${organizationId}/questions`,
			title: 'Questions'
		}
	]}
>
	<Questions {organizationId} {questions} />
</OrganizationLayout>
