<script lang="ts">
	import Quote from './Quote.svelte';
</script>

<div>
	<Quote author="Victor Hugo">He who opens a school door, closes a prison.</Quote>
</div>

<div class="row px-2 py-4">
	<div class="col-md-8">
		<img
			class="sign-in-image"
			src="https://github.com/quantu-app/design-platform/raw/master/app/resources/sign_up_and_login/1x/Door-Opening.png"
			alt="opening a door"
		/>
	</div>
	<div class="col-md-4">
		<slot />
	</div>
</div>

<style>
	.sign-in-image {
		border: 1px solid #777;
	}
</style>
