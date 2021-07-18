<script lang="ts">
	import type { Journal } from '$lib/api/quantu-app-api';
	import JournalListItem from './JournalListItem.svelte';

	export let journals: [string, Journal][];
	export let createOnDelete: (localId: string, journal: Journal) => () => void;

	$: journalsByMonth = Object.entries(
		journals.reduce<Record<string, [string, Journal][]>>((journalsByMonth, [localId, journal]) => {
			const date = new Date(journal.insertedAt),
				month = new Date(date).toLocaleString('en-us', { month: 'short', year: 'numeric' });

			const monthJournals = journalsByMonth[month] || (journalsByMonth[month] = []);

			monthJournals.push([localId, journal]);
			return journalsByMonth;
		}, {})
	);
</script>

{#each journalsByMonth as [month, journals]}
	<h2>{month}</h2>
	<div class="list-group list-group-flush">
		{#each journals as [localId, journal]}
			<JournalListItem {localId} {journal} onDelete={createOnDelete(localId, journal)} />
		{/each}
	</div>
{/each}
