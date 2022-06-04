<svelte:options immutable />

<script lang="ts">
	export let disabled = false;
	export let shown = false;
	export let input: number = 0;
</script>

<div class="d-flex my-2">
	{#if shown}
		<div class="btn-group w-100">
			<button
				type="button"
				disabled={input === 0 || (disabled && input === 0)}
				class="btn btn-danger"
				class:active={input === 0}
				on:click={() => (input = 0)}>No idea</button
			>
			<button
				type="button"
				disabled={input === 0.5 || (disabled && input === 0.5)}
				class="btn btn-secondary text-white"
				class:active={input === 0.5}
				on:click={() => (input = 0.5)}>Somewhat</button
			>
			<button
				type="button"
				disabled={input === 1 || (disabled && input === 1)}
				class="btn btn-success"
				class:active={input === 1}
				on:click={() => (input = 1)}>Exactly</button
			>
		</div>
	{:else}
		<button type="button" class="btn btn-primary ms-auto" on:click={() => (shown = true)}
			>Show</button
		>
	{/if}
</div>
