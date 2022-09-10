<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = await authGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const departmentUrl = input.params.departmentUrl;
		const department = await showDepartmentByUrl(departmentUrl, input.fetch);
		await showChallenges(departmentUrl, input.fetch);

		return {
			props: {
				departmentUrl
			}
		};
	};
</script>

<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import DepartmentChallengesMain from '$lib/components/challenges/DepartmentChallengesMain.svelte';
	import {
		challenges as challengesState,
		showChallenges,
		challengesByDepartment,
		type StateChallenge
	} from '$lib/state/challenges';
	import { departmentsByUrl, showDepartmentByUrl } from '$lib/state/departments';
	import SEO from '$lib/components/SEO/index.svelte';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import { sortByCreatedAt } from '$lib/utils';

	export let departmentUrl: string;

	$: department = $departmentsByUrl[departmentUrl];
	$: newestChallenges = $challengesState.sort(sortByCreatedAt).slice(0, 4);
</script>

<SEO
	title={`${department.name} |> Challenges`}
	description="University level problems requiring reasoning to solve."
	keywords="challenges, difficult problems, reasoning puzzles"
	robotsDirectives={['all']}
/>

<UserLayout>
	<DepartmentChallengesMain challenges={$challengesState} {newestChallenges} {department} />
</UserLayout>
