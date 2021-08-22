<script lang="ts">
	import { currentUser, signOut } from './state/user';
</script>

{#if $currentUser}
	<div class="dropdown dropup">
		<button
			id="user-dropdown"
			class="d-flex align-items-center justify-content-center p-3 btn btn-link dropdown-toggle"
			type="button"
			data-bs-toggle="dropdown"
			aria-expanded="false"
		>
			<i class="bi bi-person-circle" />
		</button>
		<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="user-dropdown">
			<li><span class="dropdown-item disabled">{$currentUser.username}</span></li>
			<li>
				<a
					type="button"
					class="dropdown-item"
					aria-label="My Organizations"
					href="/user/organizations">My Organizations</a
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
		class="d-flex align-items-center justify-content-center p-3 btn btn-link"
	>
		<i class="bi bi-box-arrow-in-right" />
	</button>
{/if}
