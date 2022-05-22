<svelte:options immutable />

<script lang="ts">
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import type { Department } from '@prisma/client';

	export let department: Department;
</script>

<p class="m-0">Name</p>
<h3>{department.name}</h3>
<p class="m-0">URL</p>
<p>{department.url}</p>
<hr />
<RichViewer value={department.description} />
