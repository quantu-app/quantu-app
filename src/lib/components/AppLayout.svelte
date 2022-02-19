<script lang="ts">
	import Layout from '$lib/components/Layout.svelte';

	export let breadcrumbs: { href?: string; title: string }[] = [];
</script>

<Layout {breadcrumbs}>
	<slot />
</Layout>
