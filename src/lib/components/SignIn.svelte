<svelte:options immutable />

<script lang="ts">
	import Quote from './ui/Quote.svelte';
</script>

<div class="col-12">
	<div class="row justify-content-md-center mb-4">
		<div class="col-md-10">
			<h2>Welcome Back</h2>
			<Quote author="Victor Hugo">He who opens a school door, closes a prison.</Quote>
		</div>
	</div>
</div>
<div class="col-12 py-4">
	<div class="row justify-content-md-center">
		<div class="col-md-10">
			<slot />
		</div>
	</div>
</div>
