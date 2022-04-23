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
				url: input.params.url,
				solutionId: input.params.solutionId
			}
		};
	}
</script>

<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { page } from '$app/stores';
	import { challengesByDepartmentUrl, showChallengeByUrl } from '$lib/state/challenges';
	import CreateSolution from '$lib/components/challenges/solutions/CreateSolution.svelte';
	import SEO from '$lib/components/SEO/index.svelte';
	import { onMount } from 'svelte';
	import ChallengeWrapper from '$lib/components/challenges/ChallengeWrapper.svelte';

	export let departmentUrl: string;
	export let url: string;

	$: challenge = ($challengesByDepartmentUrl[departmentUrl] || {})[url];

	onMount(async () => {
		await showChallengeByUrl(departmentUrl, url);
	});
</script>

{#if challenge}
	<SEO
		title={`${challenge.name} New Solution`}
		openGraph={{
			title: `${challenge.name} New Solution`,
			url: $page.url.toString(),
			type: 'website'
		}}
		twitter={{
			title: `${challenge.name} New Solution`,
			card: 'summary'
		}}
		robotsDirectives={['all']}
	/>
{/if}

<UserLayout>
	{#if challenge}
		<ChallengeWrapper {challenge}>
			<CreateSolution {challenge} />
		</ChallengeWrapper>
	{/if}
</UserLayout>
