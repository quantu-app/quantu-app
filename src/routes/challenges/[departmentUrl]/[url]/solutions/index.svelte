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
		await showChallengeSolutions(departmentUrl, url, input.fetch);

		return {
			props: {
				departmentUrl,
				url
			}
		};
	}

	function sortByVotes(a: StateChallengeSolution, b: StateChallengeSolution): number {
		const voteDiff = b.votes.reduce(countVotes, 0) - a.votes.reduce(countVotes, 0);
		const dateDiff = +b.createdAt - +a.createdAt;
		return voteDiff === 0 ? dateDiff : voteDiff;
	}
</script>

<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { page } from '$app/stores';
	import { challengesByDepartmentUrl, showChallengeByUrl } from '$lib/state/challenges';
	import Solutions from '$lib/components/challenges/solutions/Solutions.svelte';
	import SEO from '$lib/components/SEO/index.svelte';
	import {
		challengeSolutionsByUrl,
		showChallengeSolutions,
		type StateChallengeSolution
	} from '$lib/state/challengeSolutions';
	import ChallengeWrapper from '$lib/components/challenges/ChallengeWrapper.svelte';
	import { base } from '$app/paths';
	import { countVotes } from '$lib/components/ui/Vote.svelte';

	export let departmentUrl: string;
	export let url: string;

	$: challenge = ($challengesByDepartmentUrl[departmentUrl] || {})[url];
	$: solutions = (($challengeSolutionsByUrl[departmentUrl] || {})[url] || []).sort(sortByVotes);
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
					class="list-group-item list-group-item-action"
					href={`${base}/challenges/${challenge.department.url}/${challenge.url}/review`}>Review</a
				>
				<a
					role="button"
					class="list-group-item list-group-item-action active"
					href={`${base}/challenges/${challenge.department.url}/${challenge.url}/solutions`}
					>Solutions</a
				>
			</svelte:fragment>
			<Solutions {challenge} {solutions} />
		</ChallengeWrapper>
	{/if}
</UserLayout>
