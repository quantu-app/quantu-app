<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { currentUser } from '$lib/state/user';

	export let lessonName: string = 'Subsets';
	export let lessonBlockName: string = '';
	export let returnRoute: string = '';

	let lessonNameHover = false;
</script>

<nav class="navbar navbar-dark navbar-expand bg-dark">
	<div class="container">
		<a href={`${base}/${returnRoute}`} class="return-link">
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

<style lang="scss">
	.lessonName {
		color: white;
		width: 100%;
	}
	a.return-link {
		position: absolute;
		color: white;
		text-decoration: none;
	}
	a.nav-link.linkExtra {
		font-size: 20px;
	}
</style>
