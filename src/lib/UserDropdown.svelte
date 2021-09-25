<script lang="ts">
	import { currentUser, signOut } from './state/user';
</script>

{#if $currentUser}
	<div class="dropdown dropdown">
		<button
			id="user-dropdown"
			class="btn btn-primary position-absolute dropdown-toggle"
			type="button"
			data-bs-toggle="dropdown"
			aria-expanded="false"
		>
			<i class="bi bi-person-circle" />
		</button>
		<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="user-dropdown">
			<li><span class="dropdown-item disabled">{$currentUser.username}</span></li>
			{#if $currentUser.creator}
				<li>
					<a
						role="button"
						class="dropdown-item"
						aria-label="My Organizations"
						href="/user/organizations">My Organizations</a
					>
				</li>
				<li><hr class="dropdown-divider" /></li>
			{/if}
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
		class="btn btn-primary position-absolute"
	>
		<i class="bi bi-box-arrow-in-right" />
	</button>
{/if}

<style lang="scss">
	button {
		top: 0.5rem;
		right: 0.5rem;
	}
</style>
