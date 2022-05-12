<svelte:options immutable />

<script lang="ts">
	import { slide } from 'svelte/transition';
	import { notifications, removeNotification } from '$lib/state/notifications';
	import type { INotification } from '$lib/state/notifications';
	import Notification from './Notification.svelte';

	function createOnRemove(notification: INotification) {
		return function onRemove() {
			removeNotification(notification.id);
		};
	}
</script>

<div class="alerts w-100">
	<div class="container">
		{#each $notifications as notification}
			<div in:slide out:slide>
				<Notification {notification} onRemove={createOnRemove(notification)} />
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.alerts {
		position: absolute;
		bottom: 0;
		z-index: 10001;
	}
</style>
