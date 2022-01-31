<script lang="ts">
	import { base } from '$app/paths';

	import Quote from './Quote.svelte';
</script>

<div>
	<Quote author="Lao Tzu">The jounrey of a thousand miles begins with a single step.</Quote>
</div>

<div class="row px-2 py-4">
	<div class="col-md-8">
		<img
			class="sign-in-image"
			src="https://github.com/quantu-app/design-platform/raw/master/app/resources/sign_up_and_login/1x/Journey-Man.png"
			alt="Taking the first step"
		/>
	</div>
	<div class="col-md-4">
		<slot />
		<div class="mt-4">
			<p>
				By joining, you are agreeing to our <a target="_blank" href={`${base}/terms`}>Terms</a>
				and
				<a target="_blank" href={`${base}/privacy-policy`}>Privacy Policy</a>
			</p>
		</div>
	</div>
</div>

<style>
	.sign-in-image {
		border: 1px solid #ccc;
	}
</style>
