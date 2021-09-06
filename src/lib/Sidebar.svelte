<script lang="ts">
	import { page } from '$app/stores';

	export let navItems: Array<{ href: string; icon: string; title: string }>;
</script>

<div
	id="sidebar"
	class="offcanvas offcanvas-start"
	tabindex="-1"
	data-bs-backdrop="true"
	data-bs-scroll="false"
	aria-labelledby="sidebarLabel"
	style="width: 256px;"
>
	<div class="d-flex flex-column h-100">
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
		<button
			type="button"
			class="sidebar-toggle btn btn-primary position-absolute"
			data-bs-toggle="offcanvas"
			data-bs-target="#sidebar"
			aria-controls="sidebar"
		>
			<i class="bi bi-list" />
		</button>
		<hr class="mt-0" />
		<ul class="nav nav-pills flex-column mb-auto">
			{#each navItems as navItem}
				<li class="nav-item">
					<a
						href={navItem.href}
						class="nav-link"
						class:active={navItem.href === $page.path}
						title={navItem.title}
						data-bs-toggle="tooltip"
						data-bs-placement="right"
						data-bs-original-title={navItem.title}
					>
						<i class="bi bi-{navItem.icon}" />
						{navItem.title}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style lang="scss">
	.logo {
		font-family: Poppins, sans-serif;
	}
	.sidebar-toggle {
		visibility: visible;
		top: 0.5rem;
		right: -3rem;
	}
</style>
