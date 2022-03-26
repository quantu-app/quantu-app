<script lang="ts">
	import UserDropdown from './UserDropdown.svelte';
	import { base } from '$app/paths';
	import { currentUser } from '$lib/state/user';
</script>

<nav class="navbar navbar-dark navbar-expand bg-dark justify-content-between">
	<a class="navbar-brand ms-4 logo" href="/">
		<img
			src="https://raw.githubusercontent.com/quantu-app/design-platform/master/branding/logo/1x/logo-matrix-symmetric.png"
			alt="[Q]"
			width="21"
			height="21"
		/>
	</a>

	{#if $currentUser}
		<ul class="navbar-nav me-auto">
			<li class="nav-item">
				<a class="nav-link linkExtra" href={`${base}/challenges`}>Challenges</a>
			</li>
		</ul>
		<div class="navbar-nav ms-4 ms-lg-auto me-4">
			<UserDropdown />
		</div>
	{:else}
		<div class="navbar-nav ms-auto me-4">
			<button
				type="button"
				data-bs-toggle="modal"
				data-bs-target="#sign-in-up-modal"
				class="btn btn-light me-lg-4 m-2 ms-4"
			>
				Login
			</button>
			<button
				type="button"
				data-bs-toggle="modal"
				data-bs-target="#sign-in-up-modal"
				data-signup="true"
				class="btn btn-light m-2 ms-4 ms-lg-2"
			>
				Sign Up
			</button>
		</div>
	{/if}
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
