<script context="module" lang="ts">
	export function load(input: LoadInput): LoadOutput {
		const response = creatorGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}

		return {};
	}
</script>

<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import Departments from '$lib/components/creator/departments/Departments.svelte';
	import { departments, showDepartments } from '$lib/state/creator/departments';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import { onMount } from 'svelte';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/internal';

	onMount(showDepartments);
</script>

<svelte:head>
	<title>Creator Studio</title>
</svelte:head>

<StudioLayout>
	<Departments departments={$departments} />
</StudioLayout>
