<script lang="ts" context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({
		page: {
			params: { organizationId }
		}
	}) {
		return {
			props: {
				organizationId: parseInt(organizationId)
			}
		};
	}
</script>

<script lang="ts">
	import { getQuizzes, organizationQuizzes } from '$lib/state/organizationQuizzes';
	import { currentUser } from '$lib/state/user';
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';
	import Quizzes from '$lib/UserOrganizations/Quizzes/Quizzes.svelte';

	export let organizationId: number;
	let prevOrganizationId: number;

	$: quizzes = Object.values($organizationQuizzes.byOrganizationId[organizationId] || {});

	$: if ($currentUser && organizationId !== prevOrganizationId) {
		prevOrganizationId = organizationId;
		getQuizzes(organizationId);
	}
</script>

<svelte:head>
	<title>Quizzes</title>
</svelte:head>

<OrganizationLayout {organizationId}>
	<Quizzes {organizationId} {quizzes} />
</OrganizationLayout>
