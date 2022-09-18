<svelte:options immutable />

<script lang="ts">
	import UserDropdown from './UserDropdown.svelte';
	import { page } from '$app/stores';
	import { currentUser } from '$lib/state/user';
	import { challengesPath, coursesPath } from '$lib/routingUtils';
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

		{#if $currentUser}
			<ul class="navbar-nav me-auto">
				<li class="nav-item">
					<a
						class:active={$page.url.pathname.startsWith(challengesPath())}
						class="nav-link linkExtra"
						href={challengesPath()}>Challenges</a
					>
				</li>
				<li class="nav-item">
					<a
						class:active={$page.url.pathname.startsWith(coursesPath())}
						class="nav-link linkExtra"
						href={coursesPath()}>Courses</a
					>
				</li>
			</ul>
			<div class="navbar-nav ms-lg-auto">
				<UserDropdown />
			</div>
		{:else}
			<div class="navbar-nav ms-auto">
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
