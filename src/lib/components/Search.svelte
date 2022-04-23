<svelte:options immutable />

<script lang="ts">
	export let filter: string;
	export let placeholder = 'Filter...';
</script>

<form on:submit|preventDefault class="mt-2">
	<div class="input-group">
		<input type="text" class="form-control" {placeholder} bind:value={filter} />
	</div>
</form>
