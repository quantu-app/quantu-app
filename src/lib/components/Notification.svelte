<svelte:options immutable />

<script lang="ts">
	import type { INotification } from '$lib/state/notifications';

	export let notification: INotification;
	export let onRemove: () => void;
</script>

<div class={`alert alert-${notification.type} alert-dismissible`} role="alert">
	{#if notification.heading}
		<h4 class="alert-heading">{notification.heading}</h4>
	{/if}
	<p class="mb-0">{notification.description}</p>
	<button type="button" class="btn-close" aria-label="Close" on:click={onRemove} />
</div>
