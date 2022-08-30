<svelte:options immutable />

<script lang="ts">
	import { page } from '$app/stores';

	export let breadcrumbs: { href?: string; title: string }[] = [];
</script>

<div class="container mt-3">
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
