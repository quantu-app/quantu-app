<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/internal';

	export function load(input: LoadInput): LoadOutput {
		return creatorGuard(input);
	}
</script>

<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import Departments from '$lib/components/creator/departments/Departments.svelte';
	import { departments, showDepartments } from '$lib/state/creator/departments';
	import { onMount } from 'svelte';

	onMount(showDepartments);
</script>

<svelte:head>
	<title>Creator Studio</title>
</svelte:head>

<StudioLayout>
	<Departments departments={$departments} />
</StudioLayout>
