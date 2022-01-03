<script lang="ts">
	import { OpenAPI } from './api/quantu-app-api';
	import { signInWithToken } from './state/user';

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
</script>

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
				<h5 id="sign-in-up-modal-label" class="modal-title">Sign in/up with</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<button
					type="button"
					disabled={loading}
					on:click={() => signInWith('google')}
					class="btn btn-primary google w-100">Google</button
				>
				<button
					type="button"
					disabled={loading}
					on:click={() => signInWith('facebook')}
					class="btn btn-primary facebook mt-1 w-100">Facebook</button
				>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-danger text-white" data-bs-dismiss="modal"
					>Close</button
				>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
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
