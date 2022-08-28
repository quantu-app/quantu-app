<svelte:options immutable />

<script lang="ts">
	export let filter = '';
	export let placeholder = 'Filter...';
	export let onChange: (value: string) => void;

	function internalOnChange(e: Event & { currentTarget: HTMLInputElement }) {
		onChange(e.currentTarget.value);
	}
</script>

<form on:submit|preventDefault class="mt-2">
	<div class="input-group">
		<input
			type="text"
			class="form-control"
			{placeholder}
			bind:value={filter}
			on:change={internalOnChange}
		/>
	</div>
</form>
