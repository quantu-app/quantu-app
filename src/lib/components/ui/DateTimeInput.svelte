<svelte:options immutable />

<script lang="ts">
	import { format } from 'date-fns';

	export let date: string = new Date().toJSON();
	export let id = '';
	export let placeholder = '';
	export let disabled = false;

	let internalValue: string = format(new Date(date), "yyyy-MM-dd'T'HH:mm");

	const output = (x: string) => {
		date = new Date(internalValue).toJSON();
	};

	$: output(internalValue);
</script>

<input
	{id}
	class="form-control"
	type="datetime-local"
	bind:value={internalValue}
	{placeholder}
	{disabled}
/>
