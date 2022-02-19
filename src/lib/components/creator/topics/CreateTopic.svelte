<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	import { createTopic } from '$lib/state/creator/topics';
	import type { Topic } from '@prisma/client';
	import TopicEditor from './TopicEditor.svelte';

	export let path: string;
	export let parentId: string = null;

	let editorKey = Math.random();
	let creatingTopic = false;

	let topic: Partial<Topic> = {
		parentId: null
	};

	$: if (parentId !== topic.parentId) {
		topic.parentId = parentId;
	}

	async function onCreateTopic() {
		creatingTopic = true;
		try {
			await createTopic(topic);
			topic = {};
			goto(`${base}/creator/topics/${path ? `${path}/${topic.url}` : topic.url}`);
		} finally {
			creatingTopic = false;
			editorKey = Math.random();
		}
		window.bootstrap.Modal.getInstance('#create-topic').hide();
	}
</script>

<button
	type="button"
	class="btn btn-primary"
	data-bs-toggle="modal"
	data-bs-target="#create-topic"
	aria-label="Create Topic">Create Topic</button
>

<div
	class="modal fade"
	id="create-topic"
	tabindex="-1"
	aria-labelledby="create-topic-label"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="create-topic-label" class="modal-title">Create Topic</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				{#key editorKey}
					<TopicEditor bind:topic />
				{/key}
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={onCreateTopic}
					disabled={creatingTopic}
					class="btn btn-primary"
				>
					{#if creatingTopic}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{/if}
					Create
				</button>
				<button type="button" class="btn btn-secondary text-white" data-bs-dismiss="modal"
					>Close</button
				>
			</div>
		</div>
	</div>
</div>
