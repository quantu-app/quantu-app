<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = (input) => {
		const response = creatorGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const urls: string[] = input.params.urls.split('/');

		return {
			props: { urls }
		};
	};
</script>

<script lang="ts">
	import AppLayout from '$lib/components/AppLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import TopicComponent from '$lib/components/creator/topics/Topic.svelte';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import { onMount } from 'svelte';
	import { showTopics, showTopicsByUrls, topicsByPath } from '$lib/state/creator/topics';

	export let urls: string[];

	$: topic = $topicsByPath[urls.join('/')];

	onMount(async () => {
		const topics = await showTopicsByUrls(...urls);
		const topic = topics[topics.length - 1];
		await showTopics(topic.id);
	});
</script>

<svelte:head>
	<title>Creator Studio</title>
</svelte:head>

<AppLayout
	breadcrumbs={[
		{
			title: 'Creator Studio',
			href: '/creator'
		},
		{
			title: 'Topics'
		},
		...urls.map((_url, index) => {
			const path = urls.slice(0, index + 1).join('/');

			return {
				title: $topicsByPath[path]?.name,
				href: `/creator/topics/${path}`
			};
		})
	]}
>
	{#if topic}
		<TopicComponent {topic} path={urls.join('/')} />
	{/if}
</AppLayout>
