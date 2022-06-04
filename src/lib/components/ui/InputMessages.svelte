<svelte:options immutable />

<script lang="ts">
	export let className: string;
	export let messages: string[] = [];
</script>

{#each messages as message}
	<div class={className}>{message}</div>
{/each}
