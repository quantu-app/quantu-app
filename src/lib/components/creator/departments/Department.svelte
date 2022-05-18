<svelte:options immutable />

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
	import ChallengeList from '$lib/components/creator/challenges/ChallengeList.svelte';
	import CreateChallenge from '../challenges/CreateChallenge.svelte';
	import { base } from '$app/paths';
	import type { StateChallenge } from '$lib/state/creator/challenges';
	import type { StateDepartment } from '$lib/state/creator/departments';

	export let department: StateDepartment;
	export let challenges: StateChallenge[];

	function onChange(nameFilter) {
		state.update((state) => ({ ...state, nameFilter }));
	}
	$: nameFilter = $state.nameFilter;
	$: filterChallenges = (challenge: StateChallenge) =>
		nameFilter ? fuzzyEquals(nameFilter, challenge.name) : true;
	$: filteredChallenges = challenges.filter(filterChallenges);
</script>

<div class="container">
	<div class="d-flex justify-content-end mt-2">
		<div class="d-flex">
			<a class="btn btn-primary me-2" href={`${base}/creator/departments/${department.id}/assets`}
				>Assets</a
			>
			<CreateChallenge departmentId={department.id} />
		</div>
	</div>
	<Search filter={nameFilter} {onChange} />
</div>

<div class="container">
	<hr />
	<ChallengeList challenges={filteredChallenges} />
</div>
