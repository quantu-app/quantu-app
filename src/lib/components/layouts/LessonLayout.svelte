<svelte:options immutable />

<script lang="ts">
	import Notifications from '$lib/components/Notifications.svelte';
	import LessonNav from '$lib/components/lessons/LessonNav.svelte';
	import Footer from '../Footer.svelte';
</script>

<div class="d-flex flex-column min-vh-100">
	<LessonNav />
	<slot />
	<div class="mt-auto">
		<Footer />
	</div>
	<Notifications />
</div>

<style lang="scss">
	.dropdown {
		position: absolute;
		right: 0.5rem;
		top: 0.5rem;
	}
</style>
