<script context="module" lang="ts">
	import '../app.scss';
</script>

<div class="d-flex flex-row h-100">
	<div class="d-flex flex-column flex-shrink-0 p-3" style="width: 64px;">
		<button class="btn btn-light" role="button"><i class="bi bi-list" /></button>
		<ul class="nav nav-pills flex-column mb-auto" />
		<div class="flex-grow-1" />
		<ul class="nav nav-pills flex-column mb-auto">
			<li class="nav-item">
				<a href="/" class="nav-link">
					<i class="bi bi-gear" />
				</a>
			</li>
		</ul>
	</div>
	<div class="d-flex flex-column flex-grow-1 pe-3">
		<nav class="navbar">
			<div class="container-fluid">
				<a href="/" class="navbar-brand" role="button">Q[U]</a>
				<hr />
			</div>
		</nav>
		<main class="d-flex">
			<div class="d-flex flex-column flex-grow-1">
				<slot />
			</div>
		</main>
	</div>
</div>
