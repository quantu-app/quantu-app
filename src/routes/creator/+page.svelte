<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import Departments from '$lib/components/creator/departments/Departments.svelte';
	import { departments } from '$lib/state/creator/departments';
</script>

<svelte:head>
	<title>Creator Studio</title>
</svelte:head>

<StudioLayout>
	<Departments departments={$departments} />
</StudioLayout>
