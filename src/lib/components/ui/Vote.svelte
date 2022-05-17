<svelte:options immutable />

<script lang="ts" context="module">
	export type IVote = {
		vote: boolean | null;
	};

	export function countVotes(count: number, vote: IVote): number {
		return count + (vote.vote === true ? 1 : vote.vote === false ? -1 : 0);
	}
</script>

<script lang="ts">
	export let vote: boolean | null = null;
	export let votes: IVote[] = [];
	export let onVote: (vote: boolean | null) => Promise<void>;
	export let disabled = false;

	$: count = votes.reduce(countVotes, 0);

	let voting = false;
	$: onVoteUp = async () => {
		voting = true;
		try {
			await onVote(vote === false ? null : true);
		} finally {
			voting = false;
		}
	};
	$: onVoteDown = async () => {
		voting = true;
		try {
			await onVote(vote === true ? null : false);
		} finally {
			voting = false;
		}
	};
</script>

<div class="d-flex flex-column">
	<button
		class="btn btn-sm btn-ghost"
		disabled={voting || disabled || vote === true}
		on:click={onVoteUp}
	>
		<i class="bi bi-chevron-up" class:text-success={vote === true} />
	</button>
	<button class="btn btn-sm btn-ghost" disabled>
		<span class:text-success={vote === true} class:text-danger={vote === false}>
			{#if voting}
				<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
			{:else}
				{count}
			{/if}
		</span>
	</button>
	<button
		class="btn btn-sm btn-ghost"
		disabled={voting || disabled || vote === false}
		on:click={onVoteDown}
	>
		<i class="bi bi-chevron-down" class:text-danger={vote === false} />
	</button>
</div>

<style>
	.spinner-border {
		width: 14px;
		height: 14px;
	}
</style>
