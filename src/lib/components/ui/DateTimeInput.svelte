<svelte:options immutable />

<script lang="ts">
	import { format } from 'date-fns';

	export let date: string | null = new Date().toJSON();
	export let id: string = '';
	export let placeholder: string = '';
	export let disabled: boolean = false;

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
