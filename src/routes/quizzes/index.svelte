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
	import AppLayout from '$lib/AppLayout.svelte';
	import Quizzes from '$lib/Quizzes/Quizzes.svelte';
	import { getQuizzes, quizzes } from '$lib/state/quizzes';

	export let organizationId: number = undefined;

	$: quizList = Object.values(
		(organizationId ? $quizzes.byOrganizationId[organizationId] : $quizzes.byId) || {}
	);

	if (browser) {
		getQuizzes(organizationId, undefined, true);
	}
</script>

<svelte:head>
	<title>Quizzes</title>
</svelte:head>

<AppLayout
	breadcrumbs={[
		{ href: '/', title: 'Home' },
		{
			href: `/quizzes`,
			title: 'Quizzes'
		}
	]}
>
	<Quizzes quizzes={quizList} />
</AppLayout>
