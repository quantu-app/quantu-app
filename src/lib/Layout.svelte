<script lang="ts">
	import { currentUser, signIn, signUp, signOut } from './state/user';

	let isSigningIn = true;
	let usernameOrEmail: string;
	let password: string;
	let passwordConfirmation: string;
	let loading = false;

	function signInUp() {
		if (isSigningIn) {
			return signIn(usernameOrEmail, password);
		} else {
			return signUp(usernameOrEmail, password, passwordConfirmation);
		}
	}
	async function onSignInUp() {
		loading = true;
		try {
			await signInUp();
		} finally {
			loading = false;
		}

		const modal = window.bootstrap.Modal.getInstance(document.getElementById('sign-in-up-modal'));
		modal.hide();
	}
</script>

<div class="container-fluid">
	<div class="d-flex flex-row">
		<div class="d-flex flex-column align-items-center flex-shrink-0">
			<div class="d-flex">
				<a type="button" class="btn btn-ghost" href="/">Q[U]</a>
			</div>
		</div>
		<div class="d-flex flex-column flex-grow-1">
			<slot />
		</div>
		<div class="d-flex flex-column align-items-center flex-shrink-0">
			<div class="d-flex">
				{#if $currentUser}
					<button type="button" class="btn btn-light" on:click={signOut}>
						<i class="bi bi-person-circle" />
					</button>
				{:else}
					<button
						type="button"
						data-bs-toggle="modal"
						data-bs-target="#sign-in-up-modal"
						class="btn btn-light"
					>
						<i class="bi bi-box-arrow-in-right" />
					</button>
				{/if}
			</div>
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
				<h5 id="sign-in-up-modal-label" class="modal-title">Sign {isSigningIn ? 'in' : 'up'}</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="input-group">
					<h3>
						{isSigningIn ? 'Not a member?' : 'Already a member?'}
						<button
							type="button"
							on:click={() => (isSigningIn = !isSigningIn)}
							class="btn btn-primary">Sign {isSigningIn ? 'up' : 'in'}</button
						>
					</h3>
					{#if isSigningIn}
						<div>
							<label for="modal-username-or-email" class="form-label">Username or Email</label>
							<input
								id="modal-username-or-email"
								type="text"
								class="form-control"
								placeholder="Username or Email"
								bind:value={usernameOrEmail}
							/>
						</div>
						<div>
							<label for="modal-password" class="form-label">Password</label>
							<input
								id="modal-password"
								type="password"
								class="form-control"
								placeholder="Password"
								bind:value={password}
							/>
						</div>
					{:else}
						<div>
							<label for="modal-username" class="form-label">Username</label>
							<input
								id="modal-username"
								type="text"
								class="form-control"
								placeholder="Username"
								bind:value={usernameOrEmail}
							/>
						</div>
						<div>
							<label for="modal-password" class="form-label">Password</label>
							<input
								id="modal-password"
								type="password"
								class="form-control"
								placeholder="Password"
								bind:value={password}
							/>
						</div>
						<div>
							<input
								type="password"
								class="form-control"
								placeholder="Password Confirmation"
								bind:value={passwordConfirmation}
							/>
						</div>
					{/if}
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" disabled={loading} on:click={onSignInUp} class="btn btn-primary"
					>Sign {isSigningIn ? 'in' : 'up'}</button
				>
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
