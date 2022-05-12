<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import { currentUser, signOut } from '$lib/state/user';
</script>

{#if $currentUser}
	<div class="dropdown dropdown">
		<button
			id="user-dropdown"
			class="btn btn-light dropdown-toggle user-dropdown"
			type="button"
			data-bs-toggle="dropdown"
			aria-expanded="false"
		>
			<i class="bi bi-person-circle" />
		</button>
		<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="user-dropdown">
			<li><span class="dropdown-item disabled">{$currentUser.username}</span></li>
			<li><hr class="dropdown-divider" /></li>
			<li>
				<a
					role="button"
					class="dropdown-item"
					aria-label="Profile"
					href={`${base}/user/profile/${$currentUser.username}`}>Your Profile</a
				>
			</li>
			<li><hr class="dropdown-divider" /></li>
			{#if $currentUser.creator}
				<li>
					<a role="button" class="dropdown-item" aria-label="Creator Studio" href="/creator"
						>Creator Studio</a
					>
				</li>
			{/if}
			<li>
				<a role="button" class="dropdown-item" aria-label="Profile" href="/user/settings"
					>Settings</a
				>
			</li>
			<li><hr class="dropdown-divider" /></li>
			<li>
				<button type="button" class="dropdown-item" aria-label="Sign out" on:click={signOut}
					>Sign out</button
				>
			</li>
		</ul>
	</div>
{:else}
	<button
		type="button"
		data-bs-toggle="modal"
		data-bs-target="#sign-in-up-modal"
		class="btn btn-light user-dropdown"
	>
		<i class="bi bi-box-arrow-in-right" />
	</button>
{/if}

<style lang="scss">
	.user-dropdown {
		border-radius: 100%;
		padding: 0.5rem 0.75rem;
		&::after {
			display: none !important;
		}
	}
</style>
