<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export const load: Load = async (input) => {
		const response = await authGuard(input);

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
	};
</script>

<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { page } from '$app/stores';
	import { challengesByDepartmentUrl, showChallengeByUrl } from '$lib/state/challenges';
	import Challenge from '$lib/components/questions/Challenge.svelte';
	import SEO from '$lib/components/SEO/index.svelte';
	import ChallengeWrapper from '$lib/components/challenges/ChallengeWrapper.svelte';
	import { base } from '$app/paths';
	import type { Load } from '@sveltejs/kit';

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
			<h2>{challenge.name}</h2>
			<Challenge {challenge}>
				<svelte:fragment slot="extra">
					<a
						role="button"
						class="btn btn-outline-primary"
						href={`${base}/challenges/${challenge.department.url}/${challenge.url}/solutions`}
					>
						Solutions
					</a>
				</svelte:fragment>
			</Challenge>
		</ChallengeWrapper>
	{/if}
</UserLayout>
