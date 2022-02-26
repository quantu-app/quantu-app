<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		nameFilter: string | undefined;
	}

	const state = writable<IState>({
		nameFilter: undefined
	});
</script>

<script lang="ts">
	import TopicList from './TopicList.svelte';
	import CreateTopic from './CreateTopic.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Search from '$lib/components/Search.svelte';
	import type { Challenge, Topic } from '@prisma/client';
	import { topicsByParentId } from '$lib/state/creator/topics';
	import ChallengeList from '$lib/components/creator/challenges/ChallengeList.svelte';
	import { challengesByTopicId } from '$lib/state/creator/challenges';
	import CreateChallenge from '../challenges/CreateChallenge.svelte';

	export let path: string;
	export let topic: Topic;

	$: topics = $topicsByParentId[topic.id] || [];
	$: challenges = $challengesByTopicId[topic.id] || [];

	$: filterTopics = (topic: Topic) =>
		$state.nameFilter ? fuzzyEquals($state.nameFilter, topic.name) : true;
	$: filterChallenges = (challenge: Challenge) =>
		$state.nameFilter ? fuzzyEquals($state.nameFilter, challenge.name) : true;
</script>

<div class="container">
	<div class="d-flex justify-content-end mt-2">
		<div class="d-flex me-2">
			<CreateTopic {path} parentId={topic.id} />
		</div>
		<div class="d-flex">
			<CreateChallenge {path} topicId={topic.id} />
		</div>
	</div>
	<Search bind:filter={$state.nameFilter} />
</div>

<div class="container">
	<TopicList {path} parentId={topic.id} topics={topics.filter(filterTopics)} />
</div>

<div class="container">
	<hr />
	<ChallengeList {path} topicId={topic.id} challenges={challenges.filter(filterChallenges)} />
</div>
