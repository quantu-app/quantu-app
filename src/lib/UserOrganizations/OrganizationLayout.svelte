<script lang="ts">
	import Layout from '$lib/Layout.svelte';

	export let breadcrumbs: { href?: string; title: string }[] = [];
</script>

<Layout
	navItems={[
		{
			href: `/`,
			icon: 'house',
			title: 'Home'
		},
		{
			href: `/user/organizations`,
			icon: 'command',
			title: 'My Organizations'
		}
	]}
	{breadcrumbs}
>
	<slot name="sidebar" slot="sidebar" />
	<slot />
</Layout>
