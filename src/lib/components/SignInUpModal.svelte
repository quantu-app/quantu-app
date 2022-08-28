<svelte:options immutable />

<script lang="ts" context="module">
	export function closeModal() {
		const modalElement = document.getElementById('sign-in-up-modal');
		if (modalElement) {
			const modal = window.bootstrap.Modal.getOrCreateInstance(modalElement);
			modal.hide();
		} else {
			// noop
			throw new globalThis.Error('unable to find "Sign in/up modal"');
		}
	}
</script>

<script lang="ts">
	import SignIn from './SignIn.svelte';
	import SignUp from './SignUp.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/env';
	import { base } from '$app/paths';
	import Cookies from 'js-cookie';
	import { signIn } from '$lib/state/user';
	import { addNotification, NotificationType } from '$lib/state/notifications';

	let loading = false;
	let SignInUpComponent = SignIn;
	let modalElement: HTMLDivElement;

	function signInWith(provider = 'google') {
		loading = true;
		const childWindow = window.open(
			`${base}/api/oauth2/${provider}/signin?redirect=/`,
			`Login with ${provider}`,
			`width=${Math.max(window.outerWidth * 0.3, 320)},height=${Math.max(
				window.outerHeight * 0.7,
				320
			)}`
		);

		function cleanUp() {
			clearInterval(intervalId);
			loading = false;
			closeModal();
			childWindow?.close();
		}

		const intervalId = setInterval(() => {
			const hasToken = !!Cookies.get('token');
			if (!childWindow) {
				addNotification({
					type: NotificationType.Danger,
					description: 'Failed to open OAuth window'
				});
			} else if (childWindow.closed || hasToken) {
				signIn()
					.then(cleanUp)
					.catch((error: Error) => {
						if (hasToken) {
							Cookies.remove('token');
						} else {
							addNotification({
								type: NotificationType.Danger,
								description: error.message
							});
							cleanUp();
						}
					});
			}
		}, 1000);
	}

	const toggleSignInUp = () => {
		Cookies.remove('token');
		SignInUpComponent = SignInUpComponent === SignIn ? SignUp : SignIn;
	};

	function setSignInUpComponentFromTriggerElement(event: any) {
		const btn = event.relatedTarget;

		if (btn.dataset.signup) {
			SignInUpComponent = SignUp;
		} else {
			SignInUpComponent = SignIn;
		}
	}

	onMount(() => {
		modalElement.addEventListener('show.bs.modal', setSignInUpComponentFromTriggerElement, false);
	});

	onDestroy(() => {
		if (browser) {
			modalElement.removeEventListener(
				'show.bs.modal',
				setSignInUpComponentFromTriggerElement,
				false
			);
		}
	});
</script>

<div
	class="modal fade"
	id="sign-in-up-modal"
	tabindex="-1"
	aria-labelledby="sign-in-up-modal-label"
	aria-hidden="true"
	role="dialog"
	bind:this={modalElement}
>
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="container">
					<div class="row p-4 pt-0 wrapper">
						<div class="col">
							<svelte:component this={SignInUpComponent}>
								<button
									type="button"
									disabled={loading}
									on:click={() => signInWith('google')}
									class="btn btn-outline-primary google w-100 oauth mb-4 mt-md-0 mt-4 text-start"
								>
									<span class="btn-login--icon me-3"><i class="fs-4 bi-google" /></span>
									<span class="btn-login--text">Continue with Google</span>
								</button>
								<button
									type="button"
									disabled={loading}
									on:click={() => signInWith('facebook')}
									class="btn btn-outline-primary facebook w-100 oauth text-start"
								>
									<span class="btn-login--icon me-3"><i class="fs-4 bi-facebook" /></span>
									<span class="btn-login--text"> Continue with Facebook </span>
								</button>
							</svelte:component>
						</div>
					</div>
					<div class="row">
						<div class="text-center">
							{#if SignInUpComponent === SignUp}
								<p>
									Already have an account? <a
										class="link-primary sign-in-up"
										on:click={toggleSignInUp}>Sign in</a
									>
								</p>
							{:else}
								<p>
									New around here? <a class="link-primary sign-in-up" on:click={toggleSignInUp}
										>Sign up</a
									>
								</p>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	#sign-in-up-modal {
		.modal-header {
			border-bottom: none;
		}
		.btn-close {
			margin: 0;
			outline: none;
			box-shadow: none;
		}
		.sign-in-up {
			cursor: pointer;
		}
	}
	.btn-login--icon {
		position: relative;
		top: 2px;
	}
</style>
