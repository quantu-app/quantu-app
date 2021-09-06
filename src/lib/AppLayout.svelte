<script lang="ts">
	import Layout from '$lib/Layout.svelte';

	export let breadcrumbs: { href: string; title: string }[] = [];
</script>

<Layout
	navItems={[
		{
			href: `/user/organizations`,
			icon: 'command',
			title: 'My Organizations'
		},
		{
			href: `/quizzes`,
			icon: 'question',
			title: 'Quizzes'
		},
		{
			href: `/questions`,
			icon: 'list',
			title: 'Questions'
		}
	]}
	{breadcrumbs}
>
	<slot />
</Layout>
