<script lang="ts">
	import Layout from '$lib/Layout.svelte';
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
>
	<slot />
</Layout>
