<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import type { LoadInput } from '@sveltejs/kit/types/internal';

	export async function load(input: LoadInput) {
		const response = authGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const departmentUrl = input.params.departmentUrl;
		const url = input.params.url;

		await showChallengeByUrl(departmentUrl, url, input.fetch);

		return {
			props: {
				departmentUrl,
				url
			}
		};
	}
</script>

<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { page } from '$app/stores';
	import { challengesByDepartmentUrl, showChallengeByUrl } from '$lib/state/challenges';
	import ReviewChallenge from '$lib/components/questions/ReviewChallenge.svelte';
	import SEO from '$lib/components/SEO/index.svelte';
	import ChallengeWrapper from '$lib/components/challenges/ChallengeWrapper.svelte';
	import { base } from '$app/paths';

	export let departmentUrl: string;
	export let url: string;

	$: challenge = ($challengesByDepartmentUrl[departmentUrl] || {})[url];
</script>

{#if challenge}
	<SEO
		title={challenge.name}
		openGraph={{
			title: challenge.name,
			url: $page.url.toString(),
			type: 'website'
		}}
		twitter={{
			title: challenge.name,
			card: 'summary'
		}}
		robotsDirectives={['all']}
	/>
{/if}

<UserLayout>
	{#if challenge}
		<ChallengeWrapper {challenge}>
			<svelte:fragment slot="sidebar">
				<a
					role="button"
					class="list-group-item list-group-item-action"
					href={`${base}/challenges/${challenge.department.url}/${challenge.url}`}
					>{challenge.name}</a
				>
				<a
					role="button"
					class="list-group-item list-group-item-action active"
					href={`${base}/challenges/${challenge.department.url}/${challenge.url}/review`}>Review</a
				>
				<a
					role="button"
					class="list-group-item list-group-item-action"
					href={`${base}/challenges/${challenge.department.url}/${challenge.url}/solutions`}
					>Solutions</a
				>
			</svelte:fragment>
			<h2>{challenge.name}</h2>
			{#if challenge.result}
				<ReviewChallenge result={challenge.result}>
					<svelte:fragment slot="extra">
						<a role="button" class="btn btn-outline-primary" href={`${base}/challenges`}>
							Return to Challenges
						</a>
					</svelte:fragment>
				</ReviewChallenge>
			{/if}
		</ChallengeWrapper>
	{/if}
</UserLayout>
