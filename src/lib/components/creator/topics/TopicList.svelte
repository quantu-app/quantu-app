<script lang="ts">
	import DeleteTopic from './DeleteTopic.svelte';
	import TopicListItem from './TopicListItem.svelte';
	import UpdateTopic from './UpdateTopic.svelte';
	import type { Topic } from '@prisma/client';
	import { deleteTopic, updateTopic } from '$lib/state/creator/topics';

	export let path: string;
	export let parentId: string = null;
	export let topics: Topic[];

	let topic: Topic;
	let topicIndex: number;

	function createOnUpdate(t: Topic, index: number) {
		return function onUpdate() {
			topic = t;
			topicIndex = index;
		};
	}
	function createOnDelete(t: Topic, index: number) {
		return function onDelete() {
			topic = t;
			topicIndex = index;
		};
	}

	async function onUpdateTopic() {
		if (topic) {
			await updateTopic(topic.id, topic);
			topic = undefined;
			topicIndex = undefined;
		}
	}
	async function onDeleteTopic() {
		if (topic) {
			await deleteTopic(topic.id);
			topic = undefined;
			topicIndex = undefined;
		}
	}
</script>

<div class="list-group list-group-flush">
	{#each topics as topic, index (topic.id)}
		<TopicListItem
			{topic}
			{path}
			onUpdate={createOnUpdate(topic, index)}
			onDelete={createOnDelete(topic, index)}
		>
			<slot
				slot="dropdown"
				name="dropdown"
				{topic}
				onUpdate={createOnUpdate(topic, index)}
				onDelete={createOnDelete(topic, index)}
			>
				<li>
					<button
						type="button"
						class="dropdown-item justify-content-between"
						data-bs-toggle="modal"
						data-bs-target="#update-topic"
						aria-label="Update"
						on:click={createOnUpdate(topic, index)}>Update</button
					>
				</li>
				<li>
					<button
						type="button"
						class="dropdown-item justify-content-between"
						data-bs-toggle="modal"
						data-bs-target="#delete-topic"
						aria-label="Delete"
						on:click={createOnDelete(topic, index)}>Delete</button
					>
				</li>
			</slot>
		</TopicListItem>
	{/each}
</div>

<UpdateTopic {topic} {onUpdateTopic} />
<DeleteTopic {topic} {onDeleteTopic} />
