<script lang="ts">
	import { page } from '$app/stores';
	import UserDropdown from './UserDropdown.svelte';

	export let navItems: Array<{ href: string; icon: string; title: string }>;
</script>

<div class="d-flex flex-column flex-shrink-0" style="width: 4em;">
	<a
		href="/"
		class="d-block px-2 py-3 link-dark text-decoration-none logo"
		title=""
		data-bs-toggle="tooltip"
		data-bs-placement="right"
		data-bs-original-title="Quant[U]"
	>
		<strong>Q[U]</strong>
	</a>
	<ul class="nav nav-pills nav-flush flex-column mb-auto text-center">
		{#each navItems as navItem}
			<li>
				<a
					href={navItem.href}
					class="nav-link py-3 border-bottom"
					class:active={navItem.href === $page.path}
					title={navItem.title}
					data-bs-toggle="tooltip"
					data-bs-placement="right"
					data-bs-original-title={navItem.title}
				>
					<i class="bi bi-{navItem.icon}" />
				</a>
			</li>
		{/each}
	</ul>
	<div class="border-top">
		<UserDropdown />
	</div>
</div>

<style lang="scss">
	.logo {
		font-family: Poppins, sans-serif;
		font-size: 1.25em;
	}
</style>
