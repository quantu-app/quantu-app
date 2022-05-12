<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import Quote from './ui/Quote.svelte';
</script>

<div class="col-12">
	<div class="row justify-content-md-center mb-4">
		<div class="col-md-10">
			<h2>Speak Friend &amp; Enter</h2>
			<Quote author="Lao Tzu">The journey of a thousand miles begins with a single step.</Quote>
		</div>
	</div>
</div>

<div class="col-12 py-4">
	<div class="row justify-content-md-center">
		<div class="col-md-10">
			<slot />
			<div class="mt-4">
				<p>
					By joining, you are agreeing to our <a target="_blank" href={`${base}/info/terms-of-use`}
						>Terms</a
					>
					and
					<a target="_blank" href={`${base}/info/privacy-policy`}>Privacy Policy</a>
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	.sign-in-image {
		border: 1px solid #ccc;
	}
</style>
