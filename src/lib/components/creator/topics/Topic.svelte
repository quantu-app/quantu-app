<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		topicNameFilter: string | undefined;
	}

	const state = writable<IState>({
		topicNameFilter: undefined
	});
</script>

<script lang="ts">
	import TopicList from './TopicList.svelte';
	import CreateTopic from './CreateTopic.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Search from '$lib/components/Search.svelte';
	import type { Topic } from '@prisma/client';
	import { topicsByParentId } from '$lib/state/creator/topics';

	export let path: string;
	export let topic: Topic;

	$: topics = $topicsByParentId[topic.id] || [];

	$: filter = (topic: Topic) =>
		$state.topicNameFilter ? fuzzyEquals($state.topicNameFilter, topic.name) : true;
</script>

<div class="container">
	<div class="d-flex justify-content-end mt-2">
		<CreateTopic {path} parentId={topic.id} />
	</div>
	<Search bind:filter={$state.topicNameFilter} />
</div>

<div class="container">
	<TopicList {path} parentId={topic.id} topics={topics.filter(filter)} />
</div>
