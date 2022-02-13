<script lang="ts">
	import Notifications from '$lib/components/Notifications.svelte';
	import { loading } from '$lib/state/loading';
	import SignInUpModal from '$lib/components/SignInUpModal.svelte';
	import { page } from '$app/stores';
	import Nav from './Nav.svelte';
	import Footer from './Footer.svelte';

	export let breadcrumbs: { href?: string; title: string }[] = [];
</script>

<div class="d-flex flex-column min-vh-100">
	<Nav />
	<div class="container">
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				{#each breadcrumbs as breadcrumb}
					<li class="breadcrumb-item" class:active={$page.url.pathname === breadcrumb.href}>
						{#if $page.url.pathname === breadcrumb.href || !breadcrumb.href}
							{breadcrumb.title}
						{:else}
							<a
								href={breadcrumb.href}
								aria-current={$page.url.pathname === breadcrumb.href ? 'page' : undefined}
								>{breadcrumb.title}</a
							>
						{/if}
					</li>
				{/each}
			</ol>
		</nav>
	</div>
	<slot />
	<div class="mt-auto">
		<Footer />
	</div>
	<Notifications />
	<SignInUpModal />
	<div
		class="position-absolute bottom-0 left-0 progressbar progress-bar progress-bar-striped progress-bar-animated"
		class:d-none={!$loading}
		role="progressbar"
		aria-valuenow={100}
		aria-valuemin={0}
		aria-valuemax={100}
		style="width: 100%; height: 4px"
	/>
</div>

<style lang="scss">
	.dropdown {
		position: absolute;
		right: 0.5rem;
		top: 0.5rem;
	}
</style>
