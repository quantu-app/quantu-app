<script lang="ts">
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
		<i class="bi bi-chevron-up" />
	</button>
	<button class="btn btn-ghost" {disabled} on:click={onVoteDelete}>
		{count}
	</button>
	<button class="btn btn-ghost" {disabled} on:click={onVoteDown}>
		<i class="bi bi-chevron-down" />
	</button>
</div>
