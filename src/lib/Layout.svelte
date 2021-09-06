<script lang="ts">
	import Notifications from '$lib/Notifications.svelte';
	import Sidebar from '$lib/Sidebar.svelte';
	import { loading } from '$lib/state/loading';
	import SignInUpModal from '$lib/SignInUpModal.svelte';
	import { page } from '$app/stores';
	import UserDropdown from './UserDropdown.svelte';

	export let navItems: { href: string; icon: string; title: string }[] = [];
	export let breadcrumbs: { href: string; title: string }[] = [];
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
		<div class="d-flex flex-column h-100 flex-grow-1 content">
			<div class="container">
				<nav aria-label="breadcrumb">
					<ol class="breadcrumb">
						{#each breadcrumbs as breadcrumb}
							<li class="breadcrumb-item" class:active={$page.path === breadcrumb.href}>
								{#if $page.path === breadcrumb.href}
									{breadcrumb.title}
								{:else}
									<a
										href={breadcrumb.href}
										aria-current={$page.path === breadcrumb.href ? 'page' : undefined}
										>{breadcrumb.title}</a
									>
								{/if}
							</li>
						{/each}
					</ol>
				</nav>
			</div>
			<slot />
		</div>
		<div>
			<UserDropdown />
		</div>
	</div>
	<Notifications />
	<SignInUpModal />
</div>

<style lang="scss">
	@media (max-width: 576px) {
		.content {
			margin-top: 3rem;
		}
	}
</style>
