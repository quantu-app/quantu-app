<script lang="ts" context="module">
	export let active = writable(false);

	export function openSidebar() {
		active.set(true);
	}
	export function closeSidebar() {
		active.set(false);
	}

	function onToggle() {
		active.update((current) => !current);
	}
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
</script>

<div class="d-flex align-items-stretch border-end">
	<div id="sidebar" class:active={!$active} tabindex="-1" style="width: 256px;">
		<div class="d-flex flex-column h-100 position-relative">
			<div class="d-flex flex-row justify-content-between">
				<a
					href="/"
					title="Quant[U]"
					data-bs-toggle="tooltip"
					data-bs-placement="right"
					data-bs-original-title="Quant[U]"
					class="d-flex align-items-center ps-3 py-2 text-decoration-none"
				>
					<span class="fs-4 logo">Quant[U]</span>
				</a>
				<button type="button" class="btn btn-primary" on:click={onToggle}>
					<i class="bi bi-arrow-left" />
				</button>
			</div>
			<button
				type="button"
				class="sidebar-toggle btn btn-primary position-absolute"
				class:d-none={$active}
				aria-controls="sidebar"
				on:click={onToggle}
			>
				<i class="bi bi-list" />
			</button>
		</div>
	</div>
</div>

<style lang="scss">
	.logo {
		font-family: Poppins, sans-serif;
	}
	.sidebar-toggle {
		top: 0.5rem;
		right: -3rem;
	}
	#sidebar {
		min-width: 320px;
		max-width: 320px;
	}
	#sidebar.active {
		margin-left: -320px;
	}
</style>
