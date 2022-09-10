<svelte:options immutable />

<script lang="ts">
	export let lessonName: string = '';
	export let returnRoute: string = '';
</script>

<nav class="navbar navbar-dark navbar-expand bg-dark">
	<div class="container">
		<a href={returnRoute} class="return-link">
			<h5 class="mt-2">
				<i class="bi bi-chevron-left" />
				Return
			</h5>
		</a>
		<h4 class="lessonName text-center mt-2">
			{lessonName}
		</h4>
	</div>
</nav>

<style>
	.navbar {
		height: 50px;
	}
	.lessonName {
		color: white;
		width: 100%;
	}
	a.return-link {
		position: absolute;
		color: white;
		text-decoration: none;
	}
</style>
