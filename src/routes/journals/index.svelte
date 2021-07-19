<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load() {
		return {
			props: {}
		};
	}
</script>

<script lang="ts">
	import Journals from '$lib/Journals/Journals.svelte';
	import Layout from '$lib/Layout.svelte';
</script>

<svelte:head>
	<title>Journals</title>
</svelte:head>

<Layout>
	<Journals />
</Layout>
