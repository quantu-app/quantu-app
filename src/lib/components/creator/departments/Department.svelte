<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		nameFilter: string | undefined;
	}

	const state = writable<IState>({
		nameFilter: undefined
	});
</script>

<script lang="ts">
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Search from '$lib/components/Search.svelte';
	import type { Challenge, Department } from '@prisma/client';
	import ChallengeList from '$lib/components/creator/challenges/ChallengeList.svelte';
	import { challengesByDepartmentId } from '$lib/state/creator/challenges';
	import CreateChallenge from '../challenges/CreateChallenge.svelte';

	export let department: Department;

	$: challenges = $challengesByDepartmentId[department.id] || [];

	$: filterChallenges = (challenge: Challenge) =>
		$state.nameFilter ? fuzzyEquals($state.nameFilter, challenge.name) : true;
</script>

<div class="container">
	<div class="d-flex justify-content-end mt-2">
		<div class="d-flex">
			<CreateChallenge departmentId={department.id} />
		</div>
	</div>
	<Search bind:filter={$state.nameFilter} />
</div>

<div class="container">
	<hr />
	<ChallengeList challenges={challenges.filter(filterChallenges)} />
</div>
