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
	import Challenge from '$lib/components/questions/Challenge.svelte';
	import { onMount } from 'svelte';
	import { resultsByTypeAndId, showResultByTypeAndId } from '$lib/state/results';
	import ReviewChallenge from '$lib/components/questions/ReviewChallenge.svelte';

	export let departmentUrl: string;
	export let url: string;

	let loaded = false;

	$: challenge = ($challengesByDepartmentUrl[departmentUrl] || {})[url];
	$: result = challenge ? ($resultsByTypeAndId['CHALLENGE'] || {})[challenge.id] : null;

	onMount(async () => {
		const challenge = await showChallengeByUrl(departmentUrl, url);
		try {
			await showResultByTypeAndId('CHALLENGE', challenge.id);
		} finally {
			loaded = true;
		}
	});
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
	{#if challenge && !result && loaded}
		<div class="container d-flex flex-grow-1">
			<Challenge {challenge}>
				<a
					slot="extra"
					role="button"
					class="btn btn-primary"
					href={`${base}/d/${departmentUrl}/challenges/${url}/review`}
				>
					Review
				</a>
			</Challenge>
		</div>
	{/if}
	{#if result}
		<div class="container flex-grow-1">
			<ReviewChallenge {result}>
				<a slot="extra" role="button" class="btn btn-primary" href={`/challenges`}>
					Return to Challenges
				</a>
			</ReviewChallenge>
		</div>
	{/if}
</AppLayout>
