<svelte:options immutable />

<script lang="ts">
	import { now } from '$lib/state/now';
	import { timeSince } from '$lib/utils';

	export let value: Date = new Date();

	let time = timeSince(value);

	$: if ($now) {
		time = timeSince(value);
	}
</script>

{time}
