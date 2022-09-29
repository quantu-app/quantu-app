<script lang="ts">
\

	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { page } from '$app/stores';
	import { challengesByDepartmentUrl, showChallengeByUrl } from '$lib/state/challenges';
	import ReviewChallenge from '$lib/components/questions/ReviewChallenge.svelte';
	import SEO from '$lib/components/SEO/index.svelte';
	import ChallengeWrapper from '$lib/components/challenges/ChallengeWrapper.svelte';
	import { base } from '$app/paths';
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
			{#if challenge.result}
				<ReviewChallenge result={challenge.result}>
					<div slot="extra" class="d-flex justify-content-end">
						<span>
							<a
								class="link-dark"
								href={`${base}/departments/${challenge.department.url}/challenges/${challenge.url}/solutions`}
							>
								View Discussion
							</a>
							<span class="linkArrow"> &gt; </span>
						</span>
					</div>
				</ReviewChallenge>
			{/if}
		</ChallengeWrapper>
	{/if}
</UserLayout>
