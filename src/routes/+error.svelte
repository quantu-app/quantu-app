<script lang="ts">
	import PublicLayout from '$lib/components/layouts/PublicLayout.svelte';
	import { page } from '$app/stores';
</script>

<PublicLayout>
	<div class="container">
		<h1>{$page?.status} - {$page?.error?.message}</h1>
	</div>
</PublicLayout>
