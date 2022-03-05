<script lang="ts" context="module">
	export function closeModal() {
		const modal = window.bootstrap.Modal.getInstance(document.getElementById('sign-in-up-modal'));
		modal.hide();
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

	let loading = false;
	let SignInUpComponent = SignIn;
	let modalElement: HTMLDivElement;

	function signInWith(provider = 'google') {
		loading = true;
		const childWindow = window.open(
			`${base}/api/oauth2/${provider}/signin?redirect=/`,
			`${provider} sign in`,
			`width=${Math.max(window.outerWidth * 0.3, 320)},height=${Math.max(
				window.outerHeight * 0.7,
				320
			)}`
		);

		function cleanUp() {
			clearInterval(intervalId);
			loading = false;
			childWindow.close();
		}

		const intervalId = setInterval(() => {
			if (childWindow.closed || Cookies.get('token')) {
				signIn().then(closeModal).finally(cleanUp);
			}
		}, 1000);
	}

	const toggleSignInUp = () => {
		SignInUpComponent = SignInUpComponent === SignIn ? SignUp : SignIn;
	};

	function setSignInUpComponentFromTriggerElement(event) {
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
	<div class="modal-dialog modal-fullscreen" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="container">
					<div class="row mb-4 p-4 wrapper">
						<svelte:component this={SignInUpComponent}>
							<button
								type="button"
								disabled={loading}
								on:click={() => signInWith('google')}
								class="btn btn-primary google w-100 oauth mb-4 mt-md-0 mt-4">Google</button
							>
							<button
								type="button"
								disabled={loading}
								on:click={() => signInWith('facebook')}
								class="btn btn-primary facebook w-100 oauth">Facebook</button
							>
						</svelte:component>
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
		.wrapper {
			border: 1px solid #707070;
		}
		.modal-header {
			border-bottom: none;
		}
		.btn-close {
			margin-left: 0;
			outline: none;
			box-shadow: none;
		}
		.sign-in-up {
			cursor: pointer;
		}
	}

	.google {
		font-family: Roboto, arial, sans-serif;
		font-weight: bold;
		letter-spacing: 0.21px;
		color: #fff !important;
		background-color: #f00 !important;
	}
	.facebook {
		font-weight: bold;
		color: #fff !important;
		background-color: #3578e5 !important;
	}
</style>
