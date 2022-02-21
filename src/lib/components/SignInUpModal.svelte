<script lang="ts" context="module">
	export function closeModal() {
		const modal = window.bootstrap.Modal.getInstance(document.getElementById('sign-in-up-modal'));
		modal.hide();
	}
</script>

<script lang="ts">
	import { OpenAPI } from '$lib/api/quantu-app-api';
	import SignIn from './SignIn.svelte';
	import SignUp from './SignUp.svelte';
	import { signInWithToken } from '$lib/state/user';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/env';

	let loading = false;
	let SignInUpComponent = SignIn;

	function setInitialSignInUpComponent(event) {
		const btn = event.relatedTarget;
		if (btn.dataset.signup) {
			SignInUpComponent = SignUp;
		} else {
			SignInUpComponent = SignIn;
		}
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
			if (typeof token === 'string') {
				childWindow.close();
				signInWithToken(token);
				loading = false;
				closeModal();
			}
		}

		window.addEventListener('message', onMessage);

		const intervalId = setInterval(() => {
			if (childWindow.closed) {
				loading = false;
				clearInterval(intervalId);
			}
		}, 1000);
	}

	function toggleSignInUp() {
		console.log('toggle');
		if (SignInUpComponent === SignIn) {
			SignInUpComponent = SignUp;
			console.log('sign-up');
			window.location.hash = '#sign-up';
		} else {
			SignInUpComponent = SignIn;
			window.location.hash = '#sign-in';
		}

		return false;
	}

	function resetHashTag() {
		if (browser && window.location.hash) {
			window.location.hash = '';
		}
	}

	onMount(() => {
		document.addEventListener('show.bs.modal', setInitialSignInUpComponent, false);
		document.addEventListener('show.bs.modal', toggleSignInUp, false);
		document.addEventListener('hidden.bs.modal', resetHashTag, false);
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('show.bs.modal', setInitialSignInUpComponent, false);
			document.removeEventListener('show.bs.modal', toggleSignInUp, false);
			document.addEventListener('hidden.bs.modal', resetHashTag, false);
		}
	});

	if (browser && window.location.hash) {
		let hashSignInUpHash = false;
		if (window.location.hash == '#sign-up') {
			SignInUpComponent = SignUp;
			hashSignInUpHash = true;
		}
		if (window.location.hash == '#sign-in') {
			SignInUpComponent = SignIn;
			hashSignInUpHash = true;
		}

		if (hashSignInUpHash) {
			jQuery('#sign-in-up-modal').modal('show');
		}
	}
</script>

<div
	class="modal fade"
	id="sign-in-up-modal"
	tabindex="-1"
	aria-labelledby="sign-in-up-modal-label"
	aria-hidden="true"
	role="dialog"
>
	<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<svelte:component this={SignInUpComponent}>
					<button
						type="button"
						disabled={loading}
						on:click={() => signInWith('google')}
						class="btn btn-primary google w-100 oauth mt-0">Google</button
					>
					<button
						type="button"
						disabled={loading}
						on:click={() => signInWith('facebook')}
						class="btn btn-primary facebook w-100 oauth">Facebook</button
					>
				</svelte:component>
				<div class="text-center">
					{#if SignInUpComponent === SignUp}
						<p>
							Already have an account? <a
								href="#sign-in"
								class="link-primary"
								on:click={toggleSignInUp}>Sign in</a
							>
						</p>
					{:else}
						<p>
							New around here? <a href="#sign-up" class="link-primary" on:click={toggleSignInUp}
								>Sign up</a
							>
						</p>
					{/if}
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary text-white" data-bs-dismiss="modal"
					>Close</button
				>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.oauth {
		margin-top: 1rem;
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
