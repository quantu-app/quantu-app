<script context="module" lang="ts">
	export const load: Load = async (input) => {
		const response = creatorGuard(input);
		if (!isValidStatus(response)) {
			return response;
		}
		await showDepartments([], input.fetch);
		return response;
	};
</script>

<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import Departments from '$lib/components/creator/departments/Departments.svelte';
	import { departments, showDepartments } from '$lib/state/creator/departments';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import type { Load } from '@sveltejs/kit';
</script>

<svelte:head>
	<title>Creator Studio</title>
</svelte:head>

<StudioLayout>
	<Departments departments={$departments} />
</StudioLayout>
