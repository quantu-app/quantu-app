<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { page } from '$app/stores';
	import { challengesByDepartmentUrl, showChallengeByUrl } from '$lib/state/challenges';
	import Challenge from '$lib/components/questions/Challenge.svelte';
	import SEO from '$lib/components/SEO/index.svelte';
	import ChallengeWrapper from '$lib/components/challenges/ChallengeWrapper.svelte';
	import { base } from '$app/paths';
	import type { Load } from '@sveltejs/kit';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ departmentUrl, url } = data);

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
