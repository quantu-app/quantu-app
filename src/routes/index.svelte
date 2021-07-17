<script lang="ts" context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load() {
		return {
			redirect: '/journels',
			status: 301
		};
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>
