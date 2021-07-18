<script lang="ts">
	import type { Journal } from '$lib/api/quantu-app-api';
	import JournalListItem from './JournalListItem.svelte';

	export let journals: [string, Journal][];
	export let createOnDelete: (localId: string, journal: Journal) => () => void;

	$: journalsByMonth = createJournalsByMonth(journals);

	function createJournalsByMonth(journals: [string, Journal][]) {
		const journalsByMonth: Record<string, [string, Journal][]> = {},
			journalsByMonthInOrder: [string, [string, Journal][]][] = [];

		for (const [localId, journal] of journals) {
			const date = new Date(journal.insertedAt),
				month = new Date(date).toLocaleString('en-us', { month: 'short', year: 'numeric' });

			let monthJournals = journalsByMonth[month];

			if (!monthJournals) {
				monthJournals = [];
				journalsByMonth[month] = monthJournals;
				journalsByMonthInOrder.push([month, monthJournals]);
			}

			monthJournals.push([localId, journal]);
		}

		return journalsByMonthInOrder;
	}
</script>

{#each journalsByMonth as [month, journals]}
	<h2>{month}</h2>
	<div class="list-group list-group-flush">
		{#each journals as [localId, journal]}
			<JournalListItem {localId} {journal} onDelete={createOnDelete(localId, journal)} />
		{/each}
	</div>
{/each}
