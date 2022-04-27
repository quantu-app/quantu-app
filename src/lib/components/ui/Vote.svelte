<svelte:options immutable />

<script lang="ts">
	export let vote: boolean | null = null;
	export let count = 0;
	export let onVote: (vote: boolean | null) => void;
	export let disabled = false;

	function onVoteUp() {
		onVote(true);
	}
	function onVoteDown() {
		onVote(false);
	}
	function onVoteDelete() {
		onVote(null);
	}
</script>

<div class="d-flex flex-column">
	<button class="btn btn-ghost" {disabled} on:click={onVoteUp}>
		<i class="bi bi-chevron-up" class:text-success={vote === true} />
	</button>
	<button class="btn btn-ghost" {disabled} on:click={onVoteDelete}>
		<span class:text-success={vote === true} class:text-danger={vote === false}>{count}</span>
	</button>
	<button class="btn btn-ghost" {disabled} on:click={onVoteDown}>
		<i class="bi bi-chevron-down" class:text-danger={vote === false} />
	</button>
</div>
