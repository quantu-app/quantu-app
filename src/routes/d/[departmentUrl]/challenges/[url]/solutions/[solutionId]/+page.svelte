<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { page } from '$app/stores';
	import { challengesByDepartmentUrl, showChallengeByUrl } from '$lib/state/challenges';
	import Solution from '$lib/components/challenges/solutions/Solution.svelte';
	import SEO from '$lib/components/SEO/index.svelte';
	import { challengeSolutionsById, showChallengeSolutionById } from '$lib/state/challengeSolutions';
	import ChallengeWrapper from '$lib/components/challenges/ChallengeWrapper.svelte';
	import { base } from '$app/paths';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ departmentUrl, url, solutionId } = data);

	$: challenge = ($challengesByDepartmentUrl[departmentUrl] || {})[url];
	$: solution = $challengeSolutionsById[solutionId];
</script>

{#if challenge && solution}
	<SEO
		title={`${challenge.name} - ${solution.user.username}`}
		openGraph={{
			title: `${challenge.name} - ${solution.user.username}`,
			url: $page.url.toString(),
			type: 'website'
		}}
		twitter={{
			title: `${challenge.name} - ${solution.user.username}`,
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
			{#if solution}
				<Solution {challenge} {solution} />
			{/if}
		</ChallengeWrapper>
	{/if}
</UserLayout>
