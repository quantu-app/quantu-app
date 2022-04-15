<script lang="ts">
	import { base } from '$app/paths';
	import type { Asset } from '@prisma/client';

	export let asset: Asset;

	$: url = `${base}/api/assets/${asset.id}`;
</script>

{#if asset.type === 'IMAGE'}
	<img class="img-fluid" src={url} alt={asset.name} />
{/if}
