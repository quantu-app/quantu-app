<script lang="ts">
	import type { StateChallenge } from '$lib/state/creator/challenges';
	import { titleCase } from 'title-case';

	export let challenge: StateChallenge;
	export let onDeleteChallenge: () => Promise<void>;

	let deletingChallenge = false;

	async function internalOnDeleteChallenge() {
		deletingChallenge = true;
		try {
			await onDeleteChallenge();
		} finally {
			deletingChallenge = false;
		}
		window.bootstrap.Modal.getInstance('#delete-challenge').hide();
	}
</script>

<div
	class="modal fade"
	id="delete-challenge"
	tabindex="-1"
	aria-labelledby="delete-challenge-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="delete-challenge-label" class="modal-title">
					Delete {challenge?.name} - {challenge ? titleCase(challenge.type.replace('_', ' ')) : ''}
					{challenge?.id}
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={internalOnDeleteChallenge}
					class="btn btn-danger text-white"
					disabled={deletingChallenge}
				>
					{#if deletingChallenge}
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
