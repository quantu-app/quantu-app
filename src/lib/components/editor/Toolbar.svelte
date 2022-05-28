<svelte:options immutable={true} />

<script lang="ts">
	import Buttons from './Buttons.svelte';

	export let container: HTMLElement = undefined;
</script>

<div class="border-bottom p-1 pb-2 mb-1">
	<Buttons {container} />
</div>
