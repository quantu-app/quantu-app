<script lang="ts">
	import { createChallenge } from '$lib/state/creator/challenges';
	import type { Challenge } from '@prisma/client';
	import { ChallengeType } from '@prisma/client';
	import ChallengeEditor from './ChallengeEditor.svelte';

	export let path: string;
	export let topicId: string = undefined;

	let editorKey = Math.random();
	let creatingChallenge = false;

	let challenge: Partial<Challenge> = { type: ChallengeType.MULTIPLE_CHOICE, prompt: {} };

	async function onCreateChallenge() {
		creatingChallenge = true;
		try {
			await createChallenge({ ...challenge, topicId });
			delete challenge.name;
			challenge = { type: ChallengeType.MULTIPLE_CHOICE, prompt: {} };
		} finally {
			creatingChallenge = false;
			editorKey = Math.random();
		}
		window.bootstrap.Modal.getInstance('#create-challenge').hide();
	}
</script>

<button
	type="button"
	class="btn btn-primary"
	data-bs-toggle="modal"
	data-bs-target="#create-challenge"
	aria-label="Create Challenge">Create Challenge</button
>

<div
	class="modal fade"
	id="create-challenge"
	tabindex="-1"
	aria-labelledby="create-challenge-label"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="create-challenge-label" class="modal-title">Create Challenge</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				{#key editorKey}
					<ChallengeEditor bind:challenge />
				{/key}
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={onCreateChallenge}
					disabled={creatingChallenge}
					class="btn btn-primary"
				>
					{#if creatingChallenge}
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
