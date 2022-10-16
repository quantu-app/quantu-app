<svelte:options immutable />

<script lang="ts">
	export let disabled: boolean = false;
	export let checked: boolean | undefined = undefined;
	export let onChange: () => void = () => undefined;
	export let status: 'error' | 'success' | undefined = undefined;
	export let rounded: boolean = true;
</script>

<input
	class="p-2 m-0 form-check-input"
	class:rounded-circle={rounded}
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
	input[type='checkbox'].form-check-input {
		border: 2px solid black;
	}
	.form-check-input[type='checkbox'].bg-danger {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-x' viewBox='0 0 16 16'%3E%3Cpath d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E");
	}
	.form-check-input[type='checkbox'].bg-success {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-check' viewBox='0 0 16 16'%3E%3Cpath d='M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z'/%3E%3C/svg%3E");
	}
</style>
