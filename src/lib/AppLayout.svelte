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
