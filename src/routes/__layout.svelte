<script context="module" lang="ts">
	import '../app.scss';
	import { remoteStorage } from '$lib/state/remoteStorage';
	import { once } from 'svelte/internal';

	const attachRS = once(async () => {
		const { default: Widget } = await import('remotestorage-widget');
		const widget = new Widget(remoteStorage);
		widget.attach('rs-widget-container');
	});
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	onMount(attachRS);
</script>

<div id="rs-widget-container" />

<main class="d-flex flex-row">
	<div class="d-flex flex-column flex-shrink-0 px-3" style="width: 320px;">
		<a href="/" class="navbar-brand" role="button">Quant[U]</a>
		<hr />
		<ul class="nav nav-pills flex-column mb-auto">
			<li class="nav-item">
				<a href="/" class="nav-link">
					Home
					<i class="bi bi-house" />
				</a>
			</li>
		</ul>
	</div>
	<div class="d-flex flex-column flex-grow-1 pe-3">
		<slot />
	</div>
</main>

<style lang="scss">
	#rs-widget-container {
		position: absolute;
		bottom: 0;
		right: 0;
		z-index: 10001;
	}
</style>
