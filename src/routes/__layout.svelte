<script context="module" lang="ts">
	import Notifications from '$lib/Notifications.svelte';
	import '../app.scss';
</script>

<Notifications />

<div class="d-flex flex-row h-100">
	<div class="d-flex flex-column flex-shrink-0 p-3">
		<a href="/" class="navbar-brand" role="button">Q[U]</a>
		<!-- <ul class="nav nav-pills flex-column mb-auto">
			<li class="nav-item">
				<button class="btn btn-light nav-link" role="button"><i class="bi bi-list" /></button>
			</li>
		</ul>
		<div class="flex-grow-1" />
		<ul class="nav nav-pills flex-column mb-auto">
			<li class="nav-item">
				<a href="/" class="nav-link">
					<i class="bi bi-gear" />
				</a>
			</li>
		</ul> -->
	</div>
	<div class="d-flex flex-column flex-grow-1 pe-3">
		<slot />
	</div>
</div>

<style lang="scss">
	.navbar-brand {
		font-family: Poppins, sans-serif;
	}
</style>
