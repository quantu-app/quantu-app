<script lang="ts">
	import { page } from '$app/stores';

	export let navItems: Array<{ href: string; icon: string; title: string }>;

	let active = false;

	function onToggle() {
		active = !active;
	}
</script>

<div class="d-flex align-items-stretch border-end">
	<div id="sidebar" class:active tabindex="-1" style="width: 256px;">
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
				class:d-none={!active}
				aria-controls="sidebar"
				on:click={onToggle}
			>
				<i class="bi bi-list" />
			</button>
			<hr class="mt-0" />
			<slot>
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
				</ul></slot
			>
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
