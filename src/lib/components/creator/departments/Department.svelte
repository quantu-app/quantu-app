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
	import { createDepartmentDraftFromRef } from '$lib/state/creator/departmentDrafts';
	import { goto } from '$app/navigation';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';

	export let department: StateDepartment;
	export let challenges: StateChallenge[];

	let creatingDraft = false;
	async function onCreateDraft() {
		creatingDraft = true;
		try {
			const departmentDraft = await createDepartmentDraftFromRef(department.id);
			await goto(`${base}/creator/departments/drafts/${departmentDraft.id}`);
		} finally {
			creatingDraft = false;
		}
	}

	function onChange(nameFilter) {
		state.update((state) => ({ ...state, nameFilter }));
	}
	$: nameFilter = $state.nameFilter;
	$: filterChallenges = (challenge: StateChallenge) =>
		nameFilter ? fuzzyEquals(nameFilter, challenge.name) : true;
	$: filteredChallenges = challenges.filter(filterChallenges);
</script>

<div class="container">
	<h2>{department.name}</h2>
	<div>
		<RichViewer value={department.description} />
	</div>
</div>
<div class="container">
	<div class="d-flex justify-content-between mt-2">
		<div class="d-flex">
			<button class="btn btn-primary" on:click={onCreateDraft} disabled={creatingDraft}
				>Update</button
			>
		</div>
		<div class="d-flex align-items-center">
			<a class="link-dark me-2" href={`${base}/creator/departments/${department.id}/assets`}
				>Assets <i class="bi bi-chevron-right" /></a
			>
			<CreateChallenge departmentId={department.id} />
		</div>
	</div>
	<Search filter={nameFilter} {onChange} />
</div>

<div class="container">
	<ChallengeList challenges={filteredChallenges} />
</div>
