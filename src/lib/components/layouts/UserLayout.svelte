<svelte:options immutable />

<script lang="ts">
	import Notifications from '$lib/components/Notifications.svelte';
	import SignInUpModal from '$lib/components/SignInUpModal.svelte';
	import Nav from '../Nav.svelte';
	import Footer from '../Footer.svelte';
</script>

<div class="d-flex flex-column min-vh-100">
	<Nav />
	<slot />
	<div class="mt-auto">
		<Footer />
	</div>
	<Notifications />
	<SignInUpModal />
</div>

<style lang="scss">
	.dropdown {
		position: absolute;
		right: 0.5rem;
		top: 0.5rem;
	}
</style>
