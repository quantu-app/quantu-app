<script lang="ts">
	import Layout from '$lib/Layout.svelte';
	import { userOrganizations } from '$lib/state/userOrganizations';

	export let organizationId: number;

	let organization = $userOrganizations.byId[organizationId];
</script>

<Layout
	navItems={[
		{
			href: `/user/organizations`,
			icon: 'command',
			title: 'My Organizations'
		},
		{
			href: `/user/organizations/${organizationId}`,
			icon: 'app',
			title: organization?.name || 'Organization'
		},
		{
			href: `/user/organizations/${organizationId}/quizzes`,
			icon: 'question',
			title: 'Quizzes'
		},
		{
			href: `/user/organizations/${organizationId}/questions`,
			icon: 'list',
			title: 'Questions'
		}
	]}
>
	<slot />
</Layout>
