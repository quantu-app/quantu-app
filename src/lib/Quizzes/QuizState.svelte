<script lang="ts">
	export let results: (boolean | undefined)[];
</script>

<div class="d-flex flex-row">
	{#each results as result, index}
		<div class="me-1">
			<span
				class="badge"
				class:bg-success={result === true}
				class:bg-danger={result === false}
				class:bg-secondary={result === undefined}>{index + 1}</span
			>
		</div>
	{/each}
</div>
