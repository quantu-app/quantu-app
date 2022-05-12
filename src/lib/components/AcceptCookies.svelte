<svelte:options immutable />

<script lang="ts">
	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';

	let hasAcceptedCookies = true;

	function browserCookieAccepted() {
		const value = Cookies.get('qu-ca');

		if (value) {
			return true;
		} else {
			return false;
		}
	}

	function check() {
		hasAcceptedCookies = browserCookieAccepted();
	}

	function accept() {
		Cookies.set('qu-ca', 'ok', { expires: 365 });
		check();
	}

	onMount(check);
</script>

{#if !hasAcceptedCookies}
	<div class="accept-cookies-banner">
		<div class="container">
			<div class="row py-3">
				<div class="col-8">
					<p>
						<b>We use cookies to improve your experience at QuantU.</b>
						<span>
							To learn more about how and why we use cookies check out our cookie policy. You can
							set and change your cookie preferences there as you would like.
						</span>
					</p>
				</div>
				<div class="col-4">
					<div class="cookie-actions">
						<button class="btn btn-primary" on:click={accept}>Okay</button>
						<a href="/info/cookie-policy/" on:click={accept}>Policy &amp; Preferences</a>
					</div>
				</div>
			</div>
		</div>
		<button
			type="button"
			class="btn-close btn-accept-cookies"
			aria-label="Close"
			on:click={accept}
		/>
	</div>
{/if}

<style lang="scss">
	.btn-accept-cookies {
		position: absolute;
		right: 0;
		top: 0;
		padding-top: 1rem;
		background-size: 0.8em;
	}
	.accept-cookies-banner {
		z-index: 1;
		position: fixed;
		bottom: 0;
		width: 100%;

		border-top: 2px solid #404040;
		background-color: #f0f0f0;

		p {
			font-size: 14px;
		}

		.cookie-actions {
			text-align: right;
		}
	}
</style>
