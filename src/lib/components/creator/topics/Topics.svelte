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

	export let parentId: string = null;
	export let topics: Topic[];

	$: filter = (topic: Topic) =>
		$state.topicNameFilter ? fuzzyEquals($state.topicNameFilter, topic.name) : true;
</script>

<div class="container">
	<div class="d-flex justify-content-end mt-2">
		<CreateTopic {parentId} />
	</div>
	<Search bind:filter={$state.topicNameFilter} />
</div>

<div class="container">
	<TopicList {parentId} topics={topics.filter(filter)} />
</div>
