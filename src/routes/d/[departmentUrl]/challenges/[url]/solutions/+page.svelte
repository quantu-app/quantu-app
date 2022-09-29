<script lang="ts" context="module">
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
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ departmentUrl, url } = data);

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
			<Solutions {challenge} {solutions} />
		</ChallengeWrapper>
	{/if}
</UserLayout>
