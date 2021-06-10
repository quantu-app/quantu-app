<script context="module" lang="ts">
	import '../app.scss';
</script>

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
</style>
