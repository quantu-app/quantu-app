<script lang="ts">
	export let filter: string;
</script>

<form on:submit|preventDefault class="mt-2">
	<div class="input-group">
		<input type="text" class="form-control" placeholder="Filter by" bind:value={filter} />
	</div>
</form>
