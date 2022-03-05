<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import type { LoadInput } from '@sveltejs/kit/types/internal';

	export async function load(input: LoadInput) {
		const response = authGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}

		return {
			props: {
				departmentUrl: input.params.departmentUrl,
				url: input.params.url
			}
		};
	}
</script>

<script lang="ts">
	import AppLayout from '$lib/components/AppLayout.svelte';
	import { base } from '$app/paths';
	import { showDepartmentsByUrl } from '$lib/state/departments';
	import { challengesByDepartmentUrl, showChallengeByUrl } from '$lib/state/challenges';
	import { browser } from '$app/env';

	export let departmentUrl: string;
	export let url: string;

	$: challenge = ($challengesByDepartmentUrl[departmentUrl] || {})[url];

	if (browser) {
		showChallengeByUrl(departmentUrl, url);
	}
</script>

<svelte:head>
	<title>Quiz</title>
</svelte:head>

<AppLayout
	breadcrumbs={[
		{ href: `${base}/`, title: 'Home' },
		{
			href: `${base}/challenges`,
			title: 'Challenges'
		},
		{
			title: challenge?.department.name || 'Department'
		},
		{
			title: challenge?.name || 'Challenge',
			href: `${base}/d/${departmentUrl}/challenges/${url}`
		}
	]}
>
	<div class="container d-flex flex-grow-1" />
</AppLayout>
