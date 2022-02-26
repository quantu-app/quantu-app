<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import type { LoadInput } from '@sveltejs/kit/types/internal';

	export async function load(input: LoadInput) {
		const response = authGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const urls: string[] = input.params.urls.split('/');
		const url = urls.pop();

		return {
			props: { urls, url }
		};
	}
</script>

<script lang="ts">
	import AppLayout from '$lib/components/AppLayout.svelte';
	import { showTopicsByUrls, topicsByPath } from '$lib/state/topics';
	import { challengesByTopicIdUrl, showChallengeByUrl } from '$lib/state/challenges';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	export let urls: string[];
	export let url: string;

	$: topic = $topicsByPath[urls.join('/')];
	$: challenge = ($challengesByTopicIdUrl[topic?.id] || {})[url];

	onMount(async () => {
		const topics = await showTopicsByUrls(...urls);
		const topic = topics[topics.length - 1];
		await showChallengeByUrl(url, topic.id);
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
		...urls.map((_url, index) => {
			const path = urls.slice(0, index + 1).join('/');

			return {
				title: $topicsByPath[path]?.name
			};
		}),
		{
			title: challenge?.name,
			href: `${base}/challenges/${[...urls, url].join('/')}`
		},
		{
			title: 'Review',
			href: `${base}/challenges/${[...urls, url].join('/')}/review`
		}
	]}
>
	<div class="container d-flex flex-grow-1" />
</AppLayout>
