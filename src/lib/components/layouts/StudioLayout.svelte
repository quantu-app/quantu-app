<script lang="ts">
	import Notifications from '$lib/components/Notifications.svelte';
	import { loading } from '$lib/state/loading';
	import SignInUpModal from '$lib/components/SignInUpModal.svelte';
	import Nav from '../Nav.svelte';
	import Footer from '../Footer.svelte';
	import Breadcrumbs from '../Breadcrumbs.svelte';

	export let breadcrumbs: { href?: string; title: string }[] = [];
</script>

<div class="d-flex flex-column min-vh-100">
	<Nav />
	<Breadcrumbs {breadcrumbs} />
	<slot />
	<div class="mt-auto">
		<Footer />
	</div>
	<Notifications />
	<SignInUpModal />
	<div
		class="position-absolute bottom-0 left-0 progressbar progress-bar progress-bar-striped progress-bar-animated"
		class:d-none={!$loading}
		role="progressbar"
		aria-valuenow={100}
		aria-valuemin={0}
		aria-valuemax={100}
		style="width: 100%; height: 4px"
	/>
</div>

<style lang="scss">
	.dropdown {
		position: absolute;
		right: 0.5rem;
		top: 0.5rem;
	}
</style>
