<script lang="ts">
	import UserDropdown from './UserDropdown.svelte';
</script>

<nav class="px-4 py-2 bg-dark">
	<div class="d-flex justify-content-between px-4">
		<div>
			<a class="btn btn-light logo" href="/"
				><img
					src="https://raw.githubusercontent.com/quantu-app/design-platform/master/branding/logo/1x/logo-matrix-symmetric.png"
					alt="[Q]"
				/></a
			>
		</div>
		<div>
			<UserDropdown />
		</div>
	</div>
</nav>

<style lang="scss">
	.logo {
		line-height: 21px;
		border-radius: 100%;
		padding: 9px;
	}
	.logo img {
		width: 21px;
		height: 21px;
	}
</style>
