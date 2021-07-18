<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		journalNameFilter: string | undefined;
	}

	const state = writable<IState>({
		journalNameFilter: undefined
	});
</script>

<script lang="ts">
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import { beforeUpdate } from 'svelte';
	import { journals, deleteJournal } from '$lib/state/journals';
	import DeleteJournal from '$lib/Journals/DeleteJournal.svelte';
	import SearchBar from '$lib/Journals/SearchBar.svelte';
	import JournalList from './JournalList.svelte';
	import type { Journal } from '$lib/api/quantu-app-api';

	let prevJournalNameFilter: string = $state.journalNameFilter;

	let deleteJournalId: string;
	let journalToDelete: Journal;

	$: list = Object.entries($journals).filter(filter).sort(sort);

	function filter([_localId, journal]: [string, Journal]) {
		return $state.journalNameFilter ? fuzzyEquals($state.journalNameFilter, journal.name) : true;
	}

	function sort(
		[_aLocalId, aJournal]: [string, Journal],
		[_bLocalId, bJournal]: [string, Journal]
	) {
		let aValue = new Date(aJournal.insertedAt),
			bValue = new Date(bJournal.insertedAt);
		return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
	}

	function createOnDelete(journalId: string, journal: Journal) {
		return function onDelete() {
			deleteJournalId = journalId;
			journalToDelete = journal;
		};
	}

	function onDeleteJournal() {
		if (deleteJournalId) {
			deleteJournal(deleteJournalId);
			journalToDelete = undefined;
		}
	}

	beforeUpdate(() => {
		if ($state.journalNameFilter !== prevJournalNameFilter) {
			list = Object.entries($journals).filter(filter).sort(sort);
		}
	});
</script>

<SearchBar bind:journalNameFilter={$state.journalNameFilter} />

<DeleteJournal {journalToDelete} {onDeleteJournal} />

<JournalList journals={list} {createOnDelete} />
