<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { currentUser } from '$lib/state/user';
</script>

<nav class="navbar navbar-dark navbar-expand bg-dark justify-content-between">
	<div class="container">
		<a class="navbar-brand logo" href="/">
			<img
				src="https://raw.githubusercontent.com/quantu-app/design-platform/master/branding/logo/1x/logo-matrix-symmetric.png"
				alt="[Q]"
				width="21"
				height="21"
			/>
		</a>
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
	}
</style>
