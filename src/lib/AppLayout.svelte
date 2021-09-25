<script lang="ts">
	import Layout from '$lib/Layout.svelte';

	export let breadcrumbs: { href: string; title: string }[] = [];
</script>

<Layout
	navItems={[
		{
			href: `/`,
			icon: 'house',
			title: 'Home'
		}
	]}
	{breadcrumbs}
>
	<slot />
</Layout>
