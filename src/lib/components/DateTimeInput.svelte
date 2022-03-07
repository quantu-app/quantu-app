<script lang="ts">
	import { formatISO, format, parseISO, toDate, isValid } from 'date-fns';

	export let date: Date = new Date();
	export let id: string = '';
	export let placeholder: string = '';
	export let disabled: boolean = false;

	let internalValue: string;

	const input = (x: Date) => {
		if (isValid(x)) {
			internalValue = format(x, "yyyy-MM-dd'T'hh:mm");
		}
	};
	const output = (x: string) => {
		date = toDate(parseISO(x));
		if (!isValid(date)) {
			date = null;
		}
	};

	$: input(date);
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
