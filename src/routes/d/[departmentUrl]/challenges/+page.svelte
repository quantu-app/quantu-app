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

	import { sortByCreatedAt } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ departmentUrl } = data);

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
