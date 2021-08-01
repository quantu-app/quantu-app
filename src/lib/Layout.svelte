<script lang="ts">
	import { OpenAPI } from './api/quantu-app-api';
	import { currentUser, signOut, signInWithToken } from './state/user';
	import { page } from '$app/stores';

	let loading = false;

	function closeModal() {
		const modal = window.bootstrap.Modal.getInstance(document.getElementById('sign-in-up-modal'));
		modal.hide();
	}

	function signInWith(provider = 'google') {
		loading = true;
		const childWindow = window.open(
			`${OpenAPI.BASE}/auth/${provider}`,
			`${provider} sign in`,
			`width=${Math.max(window.outerWidth * 0.3, 320)},height=${Math.max(
				window.outerHeight * 0.7,
				320
			)}`
		);

		function onMessage(e: MessageEvent) {
			const token = e.data;
			childWindow.close();
			signInWithToken(token);
			loading = false;
			closeModal();
		}

		window.addEventListener('message', onMessage);

		const intervalId = setInterval(() => {
			if (childWindow.closed) {
				loading = false;
				clearInterval(intervalId);
			}
		}, 1000);
	}
</script>

<div class="h-100">
	<div class="d-flex flex-row h-100">
		<div class="d-flex flex-column align-items-start flex-shrink-0">
			<div class="d-flex">
				<a type="button" class="logo btn btn-ghost" href="/"><strong>Q[U]</strong></a>
			</div>
			<div class="d-flex btn-group" role="group" aria-label="App navigation">
				<a
					type="button"
					class="btn btn-outline-primary"
					class:disabled={$page.path === '/user/organizations'}
					href="/user/organizations"
				>
					<i class="bi bi-gear-wide" />
				</a>
			</div>
			<div class="d-flex mt-auto">
				{#if $currentUser}
					<div class="dropdown dropup">
						<button
							id="dropdown-user"
							class="btn btn-outline-primary dropdown-toggle"
							type="button"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							<i class="bi bi-person-circle" />
						</button>
						<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdown-user">
							<li><span class="dropdown-item disabled">{$currentUser.username}</span></li>
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
						class="btn btn-outline-primary"
					>
						<i class="bi bi-box-arrow-in-right" />
					</button>
				{/if}
			</div>
		</div>
		<div class="d-flex flex-column flex-grow-1">
			<slot />
		</div>
	</div>
</div>

<div
	class="modal fade"
	id="sign-in-up-modal"
	tabindex="-1"
	aria-labelledby="sign-in-up-modal-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="sign-in-up-modal-label" class="modal-title">Sign in/up</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="d-flex justify-content-center mb-4">
					<div class="d-flex">
						<button
							type="button"
							disabled={loading}
							on:click={() => signInWith('google')}
							class="btn btn-outline-secondary google"
							><img class="me-2" src="/google.svg" alt="G" />Sign in with Google</button
						>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.logo {
		font-family: Poppins, sans-serif;
		font-size: 1.25rem;
		padding: 0;
	}
	.google {
		font-family: Roboto, arial, sans-serif;
		font-weight: 500;
		letter-spacing: 0.21px;
		color: #212529 !important;
		background-color: #fff !important;
	}
</style>
