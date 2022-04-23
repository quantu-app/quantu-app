<svelte:options immutable />

<script lang="ts">
	export let disabled: boolean = false;
	export let checked: boolean = false;
	export let value: string = '';
	export let onChange = undefined;
</script>

{#if onChange}
	<input
		class="qu-checkbox form-check-input"
		type="checkbox"
		{disabled}
		{value}
		{checked}
		on:change={onChange}
	/>
{:else}
	<input class="qu-checkbox form-check-input" type="checkbox" {disabled} {value} {checked} />
{/if}

<style lang="scss">
	input.qu-checkbox[type='checkbox'] {
		padding: 14px;
		border-radius: 50%;
		border: 2px solid #202020;

		&:disabled {
			opacity: 0.9;
		}

		&:checked {
			&:hover {
				background-color: black;
			}
		}
	}
</style>
