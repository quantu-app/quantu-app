<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load() {
		return {
			redirect: '/books',
			status: 301
		};
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>
