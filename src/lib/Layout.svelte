<script lang="ts">
	import Notifications from '$lib/Notifications.svelte';
	import Sidebar from '$lib/Sidebar.svelte';
	import { loading } from '$lib/state/loading';

	export let navItems: Array<{ href: string; icon: string; title: string }>;
</script>

<div class="h-100 w-100">
	<div
		class="position-absolute top-0 left-0 progressbar progress-bar progress-bar-striped progress-bar-animated"
		class:d-none={!$loading}
		role="progressbar"
		aria-valuenow={100}
		aria-valuemin={0}
		aria-valuemax={100}
		style="width: 100%; height: 4px"
	/>
	<div class="d-flex flex-row h-100">
		<Sidebar {navItems} />
		<div class="d-flex flex-column h-100 flex-grow-1">
			<slot />
		</div>
	</div>
	<Notifications />
</div>
