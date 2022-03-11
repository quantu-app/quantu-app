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
	import { challengesByDepartmentUrl, showChallengeByUrl } from '$lib/state/challenges';
	import ReviewChallenge from '$lib/components/questions/ReviewChallenge.svelte';
	import { resultsByTypeAndId, showResultByTypeAndId } from '$lib/state/results';
	import { onMount } from 'svelte';

	export let departmentUrl: string;
	export let url: string;

	$: challenge = ($challengesByDepartmentUrl[departmentUrl] || {})[url];
	$: result = challenge ? ($resultsByTypeAndId['CHALLENGE'] || {})[challenge.id] : null;

	onMount(async () => {
		const challenge = await showChallengeByUrl(departmentUrl, url);
		showResultByTypeAndId('CHALLENGE', challenge.id);
	});
</script>

<svelte:head>
	<title>Challenge REvie</title>
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
		},
		{
			title: 'Review',
			href: `${base}/d/${departmentUrl}/challenges/${url}/review`
		}
	]}
>
	<div class="container-xxl flex-grow-1">
		{#if result}
			<ReviewChallenge {result}>
				<a slot="extra" role="button" class="btn btn-primary" href={`/challenges`}>
					Return to Challenges
				</a>
			</ReviewChallenge>
		{/if}
	</div>
</AppLayout>
