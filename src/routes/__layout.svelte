<script context="module" lang="ts">
	import "$lib/plugins";
</script>

<header class="container">
	<div class="d-flex flex-wrap align-items-center justify-content-center">
		<div class="d-flex align-items-center">
			<a href="/" class="btn btn-lg btn-primary" role="button">Books</a>
		</div>

		<div class="nav col-auto me-auto" />

		<div class="text-end" />
	</div>
</header>

<main class="container"><slot /></main>

<style lang="scss" global>
	$theme-colors: (
		'primary': #2673d8
	);

	$spacer: 0.5rem;
	$enable-rounded: false;

	@import 'bootstrap/scss/bootstrap';
	@import 'bootstrap/scss/functions';

	@import 'bootstrap/scss/variables';
	@import 'bootstrap/scss/mixins';

	@import 'bootstrap/scss/root';
	@import 'bootstrap/scss/reboot';
	@import 'bootstrap/scss/type';
	@import 'bootstrap/scss/images';
	@import 'bootstrap/scss/containers';
	@import 'bootstrap/scss/grid';

	.ql-container,
	.ql-editor {
		height: inherit !important;
	}
</style>
