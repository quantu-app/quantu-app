<script lang="ts">
	export let filter: string;
	export let placeholder: string;
</script>

<form on:submit|preventDefault class="mt-2">
	<div class="input-group">
		<input
			type="text"
			class="form-control"
			placeholder={placeholder ? placeholder : 'Filter...'}
			bind:value={filter}
		/>
	</div>
</form>
