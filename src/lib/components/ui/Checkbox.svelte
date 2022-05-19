<svelte:options immutable />

<script lang="ts">
	export let disabled: boolean = false;
	export let checked: boolean | undefined = undefined;
	export let onChange: () => void = () => undefined;
	export let status: 'error' | 'success' | undefined = undefined;
</script>

<input
	class="p-2 m-0 rounded-circle form-check-input border-2 border-dark"
	class:bg-black={status == null && checked === true}
	class:bg-danger={status == 'error'}
	class:bg-success={status == 'success'}
	type="checkbox"
	{disabled}
	value={checked != null ? checked.toString() : ''}
	{checked}
	on:change={onChange}
/>

<style>
	input[type='checkbox']:focus {
		outline: 0;
	}
</style>
