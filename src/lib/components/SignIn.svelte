<script lang="ts">
	import Quote from './ui/Quote.svelte';
</script>

<div class="col-12">
	<Quote author="Victor Hugo">He who opens a school door, closes a prison.</Quote>
</div>
<div class="col-12 py-4">
	<div class="row">
		<div class="col-md-7">
			<img
				class="sign-in-image"
				src="https://github.com/quantu-app/design-platform/raw/master/app/resources/sign_up_and_login/1x/Door-Opening.png"
				alt="opening a door"
			/>
		</div>
		<div class="col-md-5">
			<slot />
		</div>
	</div>
</div>

<style>
	.sign-in-image {
		border: 1px solid #707070;
	}
</style>
