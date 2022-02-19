<script lang="ts">
	import type { Topic } from '@prisma/client';
	import TopicEditor from './TopicEditor.svelte';

	export let topic: Topic | undefined;
	export let onUpdateTopic: () => Promise<void>;

	async function internalUpdateTopic() {
		await onUpdateTopic();
		window.bootstrap.Modal.getInstance('#update-topic').hide();
	}
</script>

<div
	class="modal fade"
	id="update-topic"
	tabindex="-1"
	aria-labelledby="update-topic-label"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="update-topic-label" class="modal-title">Update Topic</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				{#if topic}
					{#key topic.id}
						<TopicEditor bind:topic />
					{/key}
				{/if}
			</div>
			<div class="modal-footer">
				<button type="button" on:click={internalUpdateTopic} class="btn btn-primary">Update</button>
				<button type="button" class="btn btn-danger text-white" data-bs-dismiss="modal"
					>Close</button
				>
			</div>
		</div>
	</div>
</div>
