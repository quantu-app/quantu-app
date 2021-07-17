<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load() {
		return {
			props: {}
		};
	}
</script>

<script lang="ts">
	import Journels from '$lib/Journels/Journels.svelte';
	import Layout from '$lib/Layout.svelte';
</script>

<svelte:head>
	<title>Journels</title>
</svelte:head>

<Layout>
	<div class="container-md">
		<Journels />
	</div>
</Layout>
