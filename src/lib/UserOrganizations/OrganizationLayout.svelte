<script lang="ts">
	import Layout from '$lib/Layout.svelte';

	export let organizationId: number;
	export let breadcrumbs: { href?: string; title: string }[] = [];
</script>

<Layout {breadcrumbs}>
	<slot name="sidebar" slot="sidebar" />
	<slot />
</Layout>
