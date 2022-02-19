<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	export function load(input: LoadInput): LoadOutput {
		const response = creatorGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const urls: string[] = input.params.urls.split('/');

		return {
			props: { urls }
		};
	}
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
	$: if (topic) {
		showTopics(topic.id);
	}

	onMount(() => {
		showTopicsByUrls(...urls);
	});
</script>

<svelte:head>
	<title>Creator</title>
</svelte:head>

<AppLayout
	breadcrumbs={[
		{
			title: 'Creator',
			href: '/creator'
		},
		{
			title: 'Topics'
		},
		...urls.map((url, index) => {
			const path = urls.slice(0, index + 1).join('/');

			return {
				title: $topicsByPath[path]?.name,
				href: `/creator/topics/${url}`
			};
		})
	]}
>
	{#if topic}
		<TopicComponent {topic} path={urls.join('/')} />
	{/if}
</AppLayout>
