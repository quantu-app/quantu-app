<script lang="ts">
	import { onMount } from 'svelte';
	import Cookies from 'js-cookie';

	function hasAcceptedCookies() {
		const value = Cookies.get('quantu-cookies-accepted');
		if (value) {
			return true;
		} else {
			return false;
		}
	}

	function removeAcceptCookiesBanner() {
		const cookiesBanner = document.querySelector('.accept-cookies-banner');
		cookiesBanner.remove();
	}

	const check = () => {
		console.log(hasAcceptedCookies());
		if (hasAcceptedCookies()) {
			removeAcceptCookiesBanner();
		}
	};

	function okay() {
		Cookies.set('quantu-cookies-accepted', 'ok', { expires: 365 });
		check();
	}

	onMount(async () => {
		check();
	});
</script>

<div class="accept-cookies-banner">
	<div class="container">
		<div class="row py-3">
			<div class="col-8">
				<p>
					<b>We use cookies to improve your experience at QuantU.</b>
					<span>
						To learn more about how and why we use cookies check out our cookie policy. You can set
						and change your cookie preferences there as you would like.
					</span>
				</p>
			</div>
			<div class="col-4">
				<div class="cookie-actions">
					<button class="btn btn-primary" on:click={okay}>Okay</button>
					<a href="/cookie-policy/">Policy &amp; Preferences</a>
				</div>
			</div>
		</div>
	</div>
	<button type="button" class="btn-close btn-accept-cookies" aria-label="Close" on:click={okay} />
</div>

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
		height: 100px;

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
