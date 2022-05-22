<svelte:options immutable />

<script lang="ts">
	import type { StateMergeRequest } from '$lib/state/creator/mergeRequests';
	import type { ChangeType } from '@prisma/client';
	import DepartmentChange from './DepartmentChange.svelte';

	export let referenceType: ChangeType;
	export let reference: StateMergeRequest['reference'];
</script>

{#if referenceType === 'DEPARTMENT'}
	<DepartmentChange department={reference} />
{/if}
