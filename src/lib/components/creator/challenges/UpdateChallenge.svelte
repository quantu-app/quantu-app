<script lang="ts">
	import type { ChallengePrivate } from '$lib/api/quantu-app-api';
	import ChallengeEditor from './ChallengeEditor.svelte';

	export let challenge: ChallengePrivate | undefined;
	export let onUpdateChallenge: () => Promise<void>;

	async function internalUpdateChallenge() {
		await onUpdateChallenge();
		window.bootstrap.Modal.getInstance('#update-challenge').hide();
	}
</script>

<div
	class="modal fade"
	id="update-challenge"
	tabindex="-1"
	aria-labelledby="update-challenge-label"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="update-challenge-label" class="modal-title">Update Challenge</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				{#if challenge}
					{#key challenge.id}
						<ChallengeEditor bind:challenge />
					{/key}
				{/if}
			</div>
			<div class="modal-footer">
				<button type="button" on:click={internalUpdateChallenge} class="btn btn-primary"
					>Update</button
				>
				<button type="button" class="btn btn-danger text-white" data-bs-dismiss="modal"
					>Close</button
				>
			</div>
		</div>
	</div>
</div>
