<script lang="ts">
	export let disabled = false;
	export let shown = false;
	export let input: number;
</script>

<div class="d-flex my-2">
	{#if shown}
		<div class="btn-group w-100">
			<button
				type="button"
				disabled={input === 0}
				class="btn btn-danger"
				class:active={input === 0}
				on:click={!disabled ? () => (input = 0) : undefined}>No idea</button
			>
			<button
				type="button"
				disabled={input === 0.5}
				class="btn btn-secondary"
				class:active={input === 0.5}
				on:click={!disabled ? () => (input = 0.5) : undefined}>Somewhat</button
			>
			<button
				type="button"
				disabled={input === 1}
				class="btn btn-success"
				class:active={input === 1}
				on:click={!disabled ? () => (input = 1) : undefined}>Exactly</button
			>
		</div>
	{:else}
		<button type="button" class="btn btn-primary ms-auto" on:click={() => (shown = true)}
			>Show</button
		>
	{/if}
</div>
