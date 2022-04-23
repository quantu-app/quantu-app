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
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { page } from '$app/stores';
	import { challengesByDepartmentUrl, showChallengeByUrl } from '$lib/state/challenges';
	import Challenge from '$lib/components/questions/Challenge.svelte';
	import { onMount } from 'svelte';
	import SEO from '$lib/components/SEO/index.svelte';
	import ChallengeWrapper from '$lib/components/challenges/ChallengeWrapper.svelte';
	import { base } from '$app/paths';

	export let departmentUrl: string;
	export let url: string;

	$: challenge = ($challengesByDepartmentUrl[departmentUrl] || {})[url];

	onMount(async () => {
		await showChallengeByUrl(departmentUrl, url);
	});
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
				<div slot="extra">
					<a role="button" class="btn btn-outline-primary mt-2" href={`${base}/challenges`}>
						Return to Challenges
					</a>
					<a
						role="button"
						class="btn btn-outline-primary mt-2"
						href={`${base}/challenges/${challenge.department.url}/${challenge.url}/solutions`}
					>
						Solutions
					</a>
				</div>
			</Challenge>
		</ChallengeWrapper>
	{/if}
</UserLayout>
