<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	export function load(input: LoadInput): LoadOutput {
		const response = creatorGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}

		return {};
	}
</script>

<script lang="ts">
	import AppLayout from '$lib/components/AppLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import Topics from '$lib/components/creator/topics/Topics.svelte';
	import { showTopics, topicsByParentId } from '$lib/state/creator/topics';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import { onMount } from 'svelte';

	$: topics = $topicsByParentId['null'] || [];

	onMount(showTopics);
</script>

<svelte:head>
	<title>Creator</title>
</svelte:head>

<AppLayout
	breadcrumbs={[
		{
			title: 'Creator',
			href: '/creator'
		}
	]}
>
	<Topics {topics} />
</AppLayout>
