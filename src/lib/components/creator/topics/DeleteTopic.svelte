<script lang="ts">
	import type { Topic } from '@prisma/client';

	export let topic: Topic;
	export let onDeleteTopic: () => Promise<void>;

	let deletingTopic = false;

	async function internalOnDeleteTopic() {
		deletingTopic = true;
		try {
			await onDeleteTopic();
		} finally {
			deletingTopic = false;
		}
		window.bootstrap.Modal.getInstance('#delete-topic').hide();
	}
</script>

<div
	class="modal fade"
	id="delete-topic"
	tabindex="-1"
	aria-labelledby="delete-topic-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="delete-topic-label" class="modal-title">
					Delete {topic?.name}
					{topic?.id}
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-footer">
				<button type="button" on:click={internalOnDeleteTopic} class="btn btn-danger text-white">
					{#if deletingTopic}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{/if}
					Delete</button
				>
				<button type="button" class="btn btn-secondary text-white" data-bs-dismiss="modal"
					>Close</button
				>
			</div>
		</div>
	</div>
</div>
