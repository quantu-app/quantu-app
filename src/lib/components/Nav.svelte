<script lang="ts">
	import UserDropdown from './UserDropdown.svelte';
	import { base } from '$app/paths';
	import { currentUser } from '$lib/state/user';
</script>

<nav class="navbar navbar-dark navbar-expand-lg bg-dark justify-content-between">
	<a class="navbar-brand ms-4 logo" href="/">
		<img
			src="https://raw.githubusercontent.com/quantu-app/design-platform/master/branding/logo/1x/logo-matrix-symmetric.png"
			alt="[Q]"
			width="21"
			height="21"
		/>
	</a>
	<button
		class="navbar-toggler"
		type="button"
		data-toggle="collapse"
		data-target="#navbarSupportedContent"
		aria-controls="navbarSupportedContent"
		aria-expanded="false"
		aria-label="Toggle navigation"
	>
		<span class="navbar-toggler-icon" />
	</button>

	<div class="collapse navbar-collapse" id="navbarSupportedContent">
		{#if $currentUser}
			<ul class="navbar-nav">
				<li class="nav-item">
					<a class="nav-link linkExtra" href={`${base}/challenges`}>Challenges</a>
				</li>
			</ul>
			<div class="navbar-nav ms-auto me-4">
				<UserDropdown />
			</div>
		{/if}
	</div>
</nav>

<style lang="scss">
	.logo {
		line-height: 21px;
		border-radius: 100%;
		padding: 9px;
		background-color: white;
	}
	a.nav-link.linkExtra {
		font-size: 20px;
		color: white;
		opacity: 1;
	}
</style>
