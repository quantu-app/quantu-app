<script lang="ts">
	import Layout from '$lib/Layout.svelte';
</script>

<Layout
	navItems={[
		{
			href: '/user/organizations',
			icon: 'command',
			title: 'Organizations'
		}
	]}
>
	<slot />
</Layout>
